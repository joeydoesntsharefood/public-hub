import { Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../interceptors/user.interceptor';

@Controller('auth/content')
export class ContentController {
  @Get(':id')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu contéudo.'))
  async getContent(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Post(':id')
  @UseInterceptors(new ResponseInterceptor<any>('Editamos o seu contéudo.'))
  async editContent(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Post(':id/delete')
  @UseInterceptors(new ResponseInterceptor<any>('Deletamos o seu contéudo.'))
  async deleteContent(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Get('')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu contéudos.'))
  async getContents(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Post('')
  @UseInterceptors(new ResponseInterceptor<any>('Criamos o seu contéudo.'))
  async createContent(@Param('id') id: string): Promise<any> {
    return id;
  }
}
