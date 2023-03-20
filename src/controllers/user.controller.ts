import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { ResponseInterceptor } from '../interceptors/user.interceptor';

@Controller('auth/user')
export class UserController {
  constructor(private readonly service: UserService) {}

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
  @UseInterceptors(
    new ResponseInterceptor<any>('Encontramos os seguintes usuários.'),
  )
  async getusers(@Query() query: any): Promise<any> {
    const response = await this.service.getAll(query);

    return response;
  }

  @Post('')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async createuser(@Param('id') id: string): Promise<any> {
    return id;
  }
}
