import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/typeorm.config';
import { AvatarController } from 'src/controllers/avatar.controller';
import { ScheduleController } from 'src/controllers/schedule.controller';
import { UserController } from 'src/controllers/user.controller';
import { RPMLink } from 'src/entities/rpmlink.entity';
import { AvatarService } from 'src/services/avatar.service';
import { UserService } from 'src/services/user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([RPMLink]),
  ],
  controllers: [UserController, ScheduleController, AvatarController],
  providers: [UserService, AvatarService],
})
export class App {}
