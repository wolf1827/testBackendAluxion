import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/files/files.module';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { User, UserSchema } from './entities/user.entity';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    FilesModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService],
})
export class UsersModule {}
