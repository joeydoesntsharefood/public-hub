import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/configs/typeorm.config';
import Entities from 'src/entities';
import { UnAuthMiddleware } from 'src/middlewares/unauth.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Entities.RPMLink]),
  ],
  controllers: [],
  providers: [],
})
export class UnrealModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UnAuthMiddleware)
      .forRoutes({ path: 'unreal/*', method: RequestMethod.ALL });
  }
}
