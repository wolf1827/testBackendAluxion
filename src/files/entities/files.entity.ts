import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class File extends Document {
  @Prop()
  name: string;
  @Prop()
  url: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
