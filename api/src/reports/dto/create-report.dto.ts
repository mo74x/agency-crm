/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNotEmpty, IsObject, IsUUID } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  month: string;

  @IsUUID()
  projectId: string;

  @IsObject()
  content: Record<string, any>;
}
