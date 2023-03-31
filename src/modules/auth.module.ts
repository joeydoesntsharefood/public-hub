import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/typeorm.config';
import { AvatarController } from 'src/controllers/avatar.controller';
import { ContentController } from 'src/controllers/content.controller';
import { DeveloperController } from 'src/controllers/developer.controller';
import { ScheduleController } from 'src/controllers/schedule.controller';
import { UserController } from 'src/controllers/user.controller';
import { VideoCallController } from 'src/controllers/videocall.controller';
import { Emails } from 'src/entities/emails.entity';
import { Painels } from 'src/entities/painels.entity';
import { PainelsNames } from 'src/entities/painelsnames.entity';
import { RPMLink } from 'src/entities/rpmlink.entity';
import { Schedule } from 'src/entities/schedule.entity';
import { User } from 'src/entities/user.entity';
import { VideoCall } from 'src/entities/videocall.entity';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { AuthService } from 'src/services/auth.service';
import { AvatarService } from 'src/services/avatar.service';
import { ContentService } from 'src/services/content.service';
import { DeveloperService } from 'src/services/developer.service';
import { ScheduleService } from 'src/services/schedule.service';
import { UserService } from 'src/services/user.service';
import { VideoCallService } from 'src/services/videocall.service';

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
      VideoCall,
    ]),
  ],
  controllers: [
    UserController,
    ScheduleController,
    AvatarController,
    VideoCallController,
    ContentController,
    DeveloperController,
  ],
  providers: [
    UserService,
    AvatarService,
    VideoCallService,
    ScheduleService,
    AuthService,
    ContentService,
    DeveloperService,
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'auth/*', method: RequestMethod.ALL });
  }
}
