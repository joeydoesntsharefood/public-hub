import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/typeorm.config';
import { ForgetController } from 'src/controllers/forget.controller';
import { SigninController } from 'src/controllers/signin.controller';
import { SignupController } from 'src/controllers/signup.controller';
import { RPMLink } from 'src/entities/rpmlink.entity';
import { User } from 'src/entities/user.entity';
import { UnAuthMiddleware } from 'src/middlewares/unauth.middleware';
import { AuthService } from 'src/services/auth.service';
import { AvatarService } from 'src/services/avatar.service';
import { UserService } from 'src/services/user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([RPMLink, User]),
  ],
  controllers: [SigninController, SignupController, ForgetController],
  providers: [UserService, AuthService, AvatarService],
})
export class UnauthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UnAuthMiddleware)
      .forRoutes({ path: 'unauth/*', method: RequestMethod.ALL });
  }
}
