import { IsOptional, IsString } from "class-validator";

export class CaptureSessionDto {
  @IsOptional()
  @IsString()
  macAddress?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  chapId?: string;

  @IsOptional()
  @IsString()
  chapChallenge?: string;

  @IsOptional()
  @IsString()
  linkLoginOnly?: string;

  @IsOptional()
  @IsString()
  linkOrig?: string;
}
