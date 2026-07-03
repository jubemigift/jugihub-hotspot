import { IsBoolean, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreatePlanDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsString()
  @MinLength(3)
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(100)
  priceKobo!: number;

  @IsInt()
  @Min(1)
  durationMinutes!: number;

  @IsOptional()
  @IsBoolean()
  isUnlimited?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  dataLimitMb?: number;

  @IsOptional()
  @IsString()
  bandwidthProfileId?: string;
}

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(100)
  priceKobo?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @IsOptional()
  @IsBoolean()
  isUnlimited?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  dataLimitMb?: number;

  @IsOptional()
  @IsString()
  bandwidthProfileId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
