import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/typeorm.config';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import Controllers from 'src/controllers';
import Services from 'src/services';
import Entities from 'src/entities';
import { JwtModule } from '@nestjs/jwt';
import { JwtMiddleware } from 'src/middlewares/jwt.middleware';
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
    ]),
    JwtModule.register({
      secret: 'pub-2022',
      signOptions: { expiresIn: 300 },
    }),
  ],
  controllers: [
    Controllers.UserController,
    Controllers.ScheduleController,
    Controllers.AvatarController,
    Controllers.VideoCallController,
    Controllers.ContentController,
    Controllers.DeveloperController,
    Controllers.LogoutController,
    Controllers.TokenController,
  ],
  providers: [
    Services.UserService,
    Services.AvatarService,
    Services.VideoCallService,
    Services.ScheduleService,
    Services.AuthService,
    Services.ContentService,
    Services.DeveloperService,
    JwtMiddleware,
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'auth/*', method: RequestMethod.ALL });
    consumer.apply(JwtMiddleware).forRoutes('auth/*');
  }
}
