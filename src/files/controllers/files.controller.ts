import {
  Body,
  Controller,
  Delete,
  Param,
  Put,
  Get,
  Post,
  UseInterceptors,
  Bind,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import { CreateFileDto, UpdateFileDto } from '../dtos/files.dtos';
import { S3Service } from '../services/aws.service';
import { FilesService } from '../services/files.service';

@Controller('api/v1/files')
export class FilesController {
  constructor(
    private filesService: FilesService,
    private s3Service: S3Service,
  ) {}

  @Get()
  getAll() {
    return this.filesService.findAll();
  }

  @Post('save-img')
  async saveUriFile(@Body('uri') uri: string, @Body('name') name: string) {
    const result = await this.s3Service.saveUriFile(uri, name);
    if (!result) {
      return 'imagen no encontrada';
    }
    return this.filesService.create({
      url: result.Location,
      name,
    });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateFileDto,
  ) {
    const s3Result = await this.s3Service.uploadFile(file, body.name);
    if (!s3Result) {
      return 'imagen no encontrada';
    }
    return this.filesService.create({
      url: s3Result.Location,
      name: body.name,
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body('name') name: string) {
    const file = await this.filesService.findOne(id);
    const result = await this.s3Service.renameFile(file.url, file.name, name);
    if (result) {
      return this.filesService.update(id, {
        name: name,
        url: result,
      });
    }
    return {
      message: 'error',
    };
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.filesService.delete(id);
  }

  @Post('search')
  searchFile(@Body('search') search: string) {
    return this.filesService.searchFile(search);
  }
}
