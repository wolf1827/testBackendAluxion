import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { response } from 'express';
import { Model } from 'mongoose';
import { map } from 'rxjs/operators';
import { UpdateFileDto } from '../dtos/files.dtos';
import { File } from '../entities/files.entity';

@Injectable()
export class FilesService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(File.name) private fileModel: Model<File>,
  ) {}

  findAll() {
    return this.fileModel.find().exec();
  }

  async findOne(id: string) {
    const file = await this.fileModel.findById(id);
    if (!file) {
      throw new NotFoundException(`La imagen ${id} no existe`);
    }
    return file;
  }

  async create(body: any) {
    const newFile = new this.fileModel(body);
    return await newFile.save();
  }

  async update(id: string, body: UpdateFileDto) {
    const updateFile = await this.fileModel.findByIdAndUpdate(
      id,
      {
        $set: body,
      },
      { new: true },
    );
    if (!updateFile) {
      throw new NotFoundException(`La imagen ${id} no existe`);
    }

    return updateFile;
  }

  async delete(id) {
    return await this.fileModel.findOneAndDelete(id);
  }

  searchFile(search) {
    console.log(search);
    const headersRequest = {
      'Content-Type': 'application/json', // afaik this one is not needed
      Authorization: `Client-ID ${process.env.UNSPLASH_CLIEND_ID}`,
    };
    return this.httpService
      .get(`https://api.unsplash.com/search/photos?page=1&query=${search}`, {
        headers: headersRequest,
      })
      .pipe(map((response) => response.data));
  }
}
