import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RouterOSClient } from "routeros-client";
import { PrismaService } from "../prisma/prisma.service";

export interface CreateHotspotUserInput {
  username: string;
  password: string;
  profile: string;
  server?: string;
  comment: string;
  macAddress?: string;
}

@Injectable()
export class MikrotikService {
  private readonly logger = new Logger(MikrotikService.name);

  constructor(private readonly config: ConfigService, private readonly prisma: PrismaService) {}

  async createHotspotUser(input: CreateHotspotUserInput) {
    return this.withClient(async (client) => {
      const menu = client.menu("/ip/hotspot/user");
      const response = await menu.add({
        name: input.username,
        password: input.password,
        profile: input.profile,
        server: input.server ?? this.config.get<string>("MIKROTIK_DEFAULT_HOTSPOT_SERVER", "hotspot1"),
        comment: input.comment,
        "mac-address": input.macAddress
      });
      await this.logRouterEvent("CREATE_HOTSPOT_USER", { username: input.username, response });
      return response?.ret;
    });
  }

  async disableHotspotUser(username: string) {
    return this.withClient(async (client) => {
      const menu = client.menu("/ip/hotspot/user");
      const users = await menu.where("name", username).get();
      for (const user of users) await menu.where(".id", user[".id"]).update({ disabled: "yes" });
      await this.logRouterEvent("DISABLE_HOTSPOT_USER", { username });
    });
  }

  async removeHotspotUser(username: string) {
    return this.withClient(async (client) => {
      const menu = client.menu("/ip/hotspot/user");
      const users = await menu.where("name", username).get();
      for (const user of users) await menu.where(".id", user[".id"]).remove();
      await this.logRouterEvent("REMOVE_HOTSPOT_USER", { username });
    });
  }

  async disconnectActiveUser(username: string) {
    return this.withClient(async (client) => {
      const active = client.menu("/ip/hotspot/active");
      const sessions = await active.where("user", username).get();
      for (const session of sessions) await active.where(".id", session[".id"]).remove();
      await this.logRouterEvent("DISCONNECT_ACTIVE_USER", { username, count: sessions.length });
    });
  }

  async readActiveSessions() {
    return this.withClient((client) => client.menu("/ip/hotspot/active").get());
  }

  async readSystemResources() {
    return this.withClient((client) => client.menu("/system/resource").get());
  }

  buildAutoLoginUrl(input: { loginUrl: string; username: string; password: string; linkOrig?: string }) {
    const url = new URL(input.loginUrl);
    url.searchParams.set("username", input.username);
    url.searchParams.set("password", input.password);
    if (input.linkOrig) url.searchParams.set("dst", input.linkOrig);
    return url.toString();
  }

  private async withClient<T>(work: (client: any) => Promise<T>): Promise<T> {
    const client = new RouterOSClient({
      host: this.config.getOrThrow<string>("MIKROTIK_HOST"),
      port: Number(this.config.get<string>("MIKROTIK_PORT", "8728")),
      user: this.config.getOrThrow<string>("MIKROTIK_USERNAME"),
      password: this.config.getOrThrow<string>("MIKROTIK_PASSWORD"),
      tls: this.config.get<string>("MIKROTIK_TLS", "false") === "true"
    });

    try {
      await client.connect();
      const result = await work(client);
      await this.prisma.mikrotikRouter.updateMany({
        where: { host: this.config.getOrThrow<string>("MIKROTIK_HOST") },
        data: { isOnline: true, lastSyncAt: new Date(), lastFailureAt: null }
      });
      return result;
    } catch (error) {
      this.logger.error(error);
      await this.prisma.mikrotikRouter.updateMany({
        where: { host: this.config.getOrThrow<string>("MIKROTIK_HOST") },
        data: { isOnline: false, lastFailureAt: new Date() }
      });
      throw error;
    } finally {
      await client.close().catch(() => undefined);
    }
  }

  private logRouterEvent(action: string, metadata: Record<string, unknown>) {
    return this.prisma.activityLog.create({ data: { action, entityType: "MikrotikRouter", metadata } });
  }
}
