import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class StartPaymentDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsString()
  @MinLength(7)
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  planId!: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsIn(["paystack", "flutterwave", "monnify"])
  gateway?: "paystack" | "flutterwave" | "monnify";
}

export class VerifyPaymentDto {
  @IsString()
  reference!: string;

  @IsOptional()
  @IsString()
  sessionId?: string;
}
