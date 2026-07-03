import { Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PaginationDto } from "../common/dto/pagination.dto";
import { CustomersService } from "./customers.service";

@UseGuards(JwtAuthGuard)
@Controller("customers")
export class CustomersController {
  constructor(private readonly customers: CustomersService) {}

  @Get()
  list(@Query() query: PaginationDto & { search?: string }) {
    return this.customers.list(query);
  }

  @Get(":id")
  detail(@Param("id") id: string) {
    return this.customers.detail(id);
  }

  @Patch(":id/disconnect")
  disconnect(@Param("id") id: string) {
    return this.customers.disconnect(id);
  }

  @Patch(":id/disable")
  disable(@Param("id") id: string) {
    return this.customers.disable(id);
  }
}
