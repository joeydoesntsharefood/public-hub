import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AvatarService } from 'src/services/avatar.service';
import { ResponseInterceptor } from '../interceptors/user.interceptor';

@Controller('avatar')
export class AvatarController {
  constructor(private readonly service: AvatarService) {}

  @Get(':id')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu avatar.'))
  async getavatar(@Param('id') id: string): Promise<any> {
    const response = await this.service.findOne(Number(id));

    if (!response)
      throw new NotFoundException('Não foi possíve encontrar o seu avatar.');

    return response;
  }

  @Post(':id')
  @UseInterceptors(new ResponseInterceptor<any>('Editamos o seu avatar.'))
  async editavatar(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Post(':id/delete')
  @UseInterceptors(new ResponseInterceptor<any>('Deletamos o seu avatar.'))
  async deleteavatar(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Get('')
  @UseInterceptors(
    new ResponseInterceptor<any>('Encontramos o seguintes avatares.'),
  )
  async getavatars(): Promise<any> {
    return await this.service.findAll();
  }

  @Post('')
  @UseInterceptors(new ResponseInterceptor<any>('Criamos o seu avatar.'))
  async createavatar(@Param('id') id: string): Promise<any> {
    return id;
  }
}
