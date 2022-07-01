import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesController } from './controllers/files.controller';
import { File, FileSchema } from './entities/files.entity';
import { S3Service } from './services/aws.service';
import { FilesService } from './services/files.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: File.name,
        schema: FileSchema,
      },
    ]),
  ],
  controllers: [FilesController],
  providers: [FilesService, S3Service],
  exports: [FilesService],
})
export class FilesModule {}
