import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { Blob } from 'buffer';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_KEY_SECRET,
  });
  constructor(private readonly httpService: HttpService) {}

  async uploadFile(file, newName) {
    if (!file?.originalname) {
      return false;
    }
    const { originalname } = file;
    const splitName = originalname.split('.');
    newName = `${newName}.${splitName[splitName.length - 1]}`;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      newName,
      file.mimetype,
    );
  }

  async renameFile(filename, oldName, newName) {
    const splitName = filename.split('.');
    newName = `${newName}.${splitName[splitName.length - 1]}`;
    oldName = `${oldName}.${splitName[splitName.length - 1]}`;
    return await this.s3_rename(oldName, newName, this.AWS_S3_BUCKET);
  }

  async s3_rename(oldName, newName, bucket) {
    const params = {
      Bucket: bucket,
      CopySource: `${bucket}/${oldName}`,
      Key: `${newName}`,
      ACL: 'public-read',
      ContentDisposition: 'inline',
    };

    try {
      await this.s3.copyObject(params).promise();

      return `https://${bucket}.s3.eu-west-1.amazonaws.com/${newName}`;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async s3_delete(name, bucket) {
    const params = {
      Bucket: bucket,
      Key: String(name),
    };

    try {
      const s3Response = await this.s3.deleteObject(params).promise();
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      console.log('s3Response', s3Response);
      return s3Response;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async saveUriFile(uri, name) {
    const response = await this.httpService
      .get(uri, {
        responseType: 'arraybuffer',
      })
      .toPromise();

    const selectFile = new Uint8Array(response.data.buffer);
    const data = await this.s3_upload(
      selectFile,
      this.AWS_S3_BUCKET,
      name,
      response.headers['content-type'],
    );
    return data;
  }
}
