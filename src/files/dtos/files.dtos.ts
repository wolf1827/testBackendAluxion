import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  url?: string;
  readonly file: Express.Multer.File;
}

export class UpdateFileDto extends PartialType(CreateFileDto) {}
