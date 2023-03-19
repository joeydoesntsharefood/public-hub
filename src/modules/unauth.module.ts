import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/typeorm.config';
import { SigninController } from 'src/controllers/signin.controller';
import { RPMLink } from 'src/entities/rpmlink.entity';
import { UnAuthMiddleware } from 'src/middlewares/unauth.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([RPMLink]),
  ],
  controllers: [SigninController],
  providers: [],
})
export class UnauthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UnAuthMiddleware)
      .forRoutes({ path: 'unauth/*', method: RequestMethod.ALL });
  }
}
