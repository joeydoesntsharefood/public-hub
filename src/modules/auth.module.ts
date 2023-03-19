import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/typeorm.config';
import { AvatarController } from 'src/controllers/avatar.controller';
import { ScheduleController } from 'src/controllers/schedule.controller';
import { UserController } from 'src/controllers/user.controller';
import { Emails } from 'src/entities/emails.entity';
import { Painels } from 'src/entities/painels.entity';
import { PainelsNames } from 'src/entities/painelsnames.entity';
import { RPMLink } from 'src/entities/rpmlink.entity';
import { Schedule } from 'src/entities/schedule.entity';
import { User } from 'src/entities/user.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { AvatarService } from 'src/services/avatar.service';
import { UserService } from 'src/services/user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      RPMLink,
      User,
      Painels,
      PainelsNames,
      Schedule,
      Emails,
    ]),
  ],
  controllers: [UserController, ScheduleController, AvatarController],
  providers: [UserService, AvatarService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'auth/*', method: RequestMethod.ALL });
  }
}
