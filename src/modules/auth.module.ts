import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/typeorm.config';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import Controllers from 'src/controllers';
import Services from 'src/services';
import Entities from 'src/entities';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      Entities.RPMLink,
      Entities.User,
      Entities.Painels,
      Entities.PainelsNames,
      Entities.Schedule,
      Entities.Emails,
      Entities.VideoCall,
      Entities.Analytics,
    ]),
  ],
  controllers: [
    Controllers.UserController,
    Controllers.ScheduleController,
    Controllers.AvatarController,
    Controllers.VideoCallController,
    Controllers.ContentController,
    Controllers.DeveloperController,
    Controllers.LogoutController,
    Controllers.AnalyticController,
  ],
  providers: [
    Services.UserService,
    Services.AvatarService,
    Services.VideoCallService,
    Services.ScheduleService,
    Services.AuthService,
    Services.ContentService,
    Services.DeveloperService,
    Services.AnalyticService,
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'auth/*', method: RequestMethod.ALL });
  }
}
