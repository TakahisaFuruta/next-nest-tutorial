import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
