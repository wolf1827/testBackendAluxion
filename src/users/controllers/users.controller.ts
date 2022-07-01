import {
  Controller,
  Param,
  Post,
  Body,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { File } from 'src/files/entities/files.entity';
import { FilesService } from 'src/files/services/files.service';
import { Gallery } from '../entities/gallery.entity';
import { User } from '../entities/user.entity';

@Controller('api/v1/users')
export class UsersController {
  constructor(private fileService: FilesService) {}
}
