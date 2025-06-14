import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PostJobDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  requirements: string[];

  @IsNotEmpty()
  @IsNumber()
  salary: number;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  jobType: string;

  @IsNotEmpty()
  @IsString()
  experienceLevel: string;

  @IsNotEmpty()
  @IsNumber()
  position: number;

  @IsNotEmpty()
  @IsString()
  companyId: string;

  @IsOptional()
  @IsString()
  createdById?: string;
}
