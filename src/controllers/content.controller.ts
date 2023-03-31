import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from '../interceptors/user.interceptor';
import { ContentService } from 'src/services/content.service';
import { z } from 'zod';

@Controller('auth/content')
export class ContentController {
  constructor(private readonly service: ContentService) {}

  @Get('')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu contéudos.'))
  async getContents(@Query() query: any): Promise<any> {
    let search;

    if (query && query?.search) {
      search = query?.search;
      delete query?.search;
    }

    if (query && query?.id) {
      query.id = Number(query?.id);
    }

    const response = await this.service.getAllPainels(query, search);

    const filterPainels = response.filter((value) => value?.inUse);

    if (!filterPainels)
      throw new BadRequestException(
        'Não foi possível encontrar nenhum painel.',
      );

    const data = Promise.all(
      filterPainels?.map(async (value) => {
        const response = await this.service.getAllContents({
          painelId: value?.id,
        });

        return {
          painelName: value?.name,
          painelId: value?.id,
          contents: response,
        };
      }),
    );

    return data;
  }

  @Post('')
  @UseInterceptors(new ResponseInterceptor<any>('Criamos o seu contéudo.'))
  async createContent(@Body() body: any): Promise<any> {
    const createContentSchema = z.object({
      painelName: z.string(),
      painelId: z.number(),
    });

    const validateBody = createContentSchema.parse(body);

    if (!validateBody) throw new BadRequestException('Dados invalidos.');

    const response = await this.service.editPainelsName(
      { id: validateBody?.painelId },
      {
        id: validateBody?.painelId,
        name: validateBody?.painelName,
        inUse: true,
      },
    );

    if (!response)
      throw new BadRequestException(
        'Não foi possíve registrar o nome do seu painel.',
      );

    const responseDelete = await this.service.deleteContentInEdit(
      validateBody?.painelId,
    );

    if (!responseDelete)
      throw new BadRequestException('Não foi possível salvar seus contéudos.');

    let responseCreate;

    if (body?.contents)
      responseCreate = await this.service.createContents(body?.contents);

    if (body?.contents && !responseCreate)
      throw new BadRequestException('Não foi possível salvar seus contéudos.');

    return;
  }
}
