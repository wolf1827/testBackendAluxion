import { Global, Inject, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import config from 'config';
import { ConfigType } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:root@localhost:27017', {
      user: 'root',
      pass: 'root',
      dbName: 'bank-files',
    }),
  ],
  providers: [],
  exports: [MongooseModule],
})
export class DatabaseModule {}
