import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/typeorm.config';
import { UnAuthMiddleware } from 'src/middlewares/unauth.middleware';
import Controllers from 'src/controllers';
import Entities from 'src/entities';
import Services from 'src/services';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      Entities.RPMLink,
      Entities.User,
      Entities.Analytics,
    ]),
  ],
  controllers: [
    Controllers.SigninController,
    Controllers.SignupController,
    Controllers.ForgetController,
    Controllers.UserValidateController,
    Controllers.FirstAccessController,
  ],
  providers: [
    Services.UserService,
    Services.AuthService,
    Services.AvatarService,
    Services.AnalyticService,
  ],
})
export class UnauthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UnAuthMiddleware)
      .forRoutes({ path: 'unauth/*', method: RequestMethod.ALL });
  }
}
