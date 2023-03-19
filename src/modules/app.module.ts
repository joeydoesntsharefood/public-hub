import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { UnauthModule } from './unauth.module';
import { UnrealModule } from './unreal.module';

@Module({
  imports: [AuthModule, UnauthModule, UnrealModule],
})
export class App {}
