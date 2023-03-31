import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AvatarService } from 'src/services/avatar.service';
import { ResponseInterceptor } from '../interceptors/user.interceptor';

@Controller('auth/avatar')
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
  async editavatar(@Param('id') id: string, @Body() body: any): Promise<any> {
    const response = await this.service.editOne(Number(id), body);

    if (!response)
      throw new BadRequestException('Não foi possível atualizar o seu avatar.');

    return;
  }

  @Post(':id/delete')
  @UseInterceptors(new ResponseInterceptor<any>('Deletamos o seu avatar.'))
  async deleteavatar(@Param('id') id: string): Promise<any> {
    const response = await this.service.delete(Number(id));

    if (!response)
      throw new BadRequestException('Não foi possível deletar o avatar.');

    return;
  }

  @Get('')
  @UseInterceptors(
    new ResponseInterceptor<any>('Encontramos o seguintes avatares.'),
  )
  async getavatars(@Query() query: any): Promise<any> {
    const response = await this.service.findAll(query);

    if (!response)
      throw new BadRequestException(
        'Não foi possível encontrar os dados solicitados.',
      );

    return response;
  }

  @Post('')
  @UseInterceptors(new ResponseInterceptor<any>('Criamos o seu avatar.'))
  async createavatar(@Body() body: any): Promise<any> {
    const { link } = body;

    if (!link)
      throw new BadRequestException(
        'Não encontramos o seu link de avatar para a criação do registro.',
      );

    const response = await this.service.create(link);

    if (!response)
      throw new BadRequestException(
        'Não conseguimos registrar o seu link de avatar.',
      );

    return;
  }
}
