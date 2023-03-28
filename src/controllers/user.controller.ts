import {
  BadRequestException,
  Body,
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
    const response = await this.service.findOne({ id: Number(id) });

    if (!response)
      throw new BadRequestException(
        'Não foi possível encontrar o usuário solicitado',
      );

    return response;
  }

  @Post(':id')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async edituser(@Param('id') id: string, @Body() body: any): Promise<any> {
    const response = await this.service.editUser(body, Number(id));

    if (!response)
      throw new BadRequestException('Não foi possível editar o seu usuário.');

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

    if (!Array.isArray(response))
      throw new BadRequestException(
        'Não foi possível encontrar nenhum usuário.',
      );

    return response;
  }

  @Post('')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async createuser(@Param('id') id: string): Promise<any> {
    return id;
  }
}
