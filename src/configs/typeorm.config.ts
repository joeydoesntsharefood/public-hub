import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'agriland11971.c42.integrator.host',
  port: 3306,
  username: 'adminagrila_admin',
  password: 'aqt39HJrFcF5KaD',
  database: 'adminagrila_agriland_dba',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
