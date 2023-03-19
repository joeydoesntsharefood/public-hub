import { Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../interceptors/user.interceptor';

@Controller('unauth/signin')
export class SigninController {
  @Post('')
  @UseInterceptors(new ResponseInterceptor('Autenticamos seus dados.'))
  async signin() {
    return 'teste';
  }
}
