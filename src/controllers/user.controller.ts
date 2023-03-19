import { Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../interceptors/user.interceptor';

@Controller('user')
export class UserController {
  @Get(':id')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async getuser(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Post(':id')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async edituser(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Post(':id/delete')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async deleteuser(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Get('')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async getusers(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Post('')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async createuser(@Param('id') id: string): Promise<any> {
    return id;
  }
}
