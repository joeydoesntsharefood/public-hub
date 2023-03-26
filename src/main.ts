import { NestFactory } from '@nestjs/core';
import { App } from './modules/app.module';
import * as dotenv from 'dotenv';
import { timerLogger } from './utils/timerLogger.utils';

async function bootstrap() {
  const app = await NestFactory.create(App);
  dotenv.config();

  app.enableCors();

  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    const infos = `Web server listing ${port}`;
    timerLogger({ infos, modules: 'Server' });
  });
}

bootstrap();
