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
import { Painels } from 'src/entities/painels.entity';
import { parse } from 'url';

@Controller('auth/content')
export class ContentController {
  constructor(private readonly service: ContentService) {}

  @Get('nouse')
  @UseInterceptors(
    new ResponseInterceptor<any>(
      'Encontramos os seguintes paineis disponiveis.',
    ),
  )
  async getNoUsePainels() {
    const response = await this.service.getAllPainels();

    return response;
  }

  @Get('')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu contéudos.'))
  async getContents(@Query() query: any): Promise<any> {
    let search;

    if (query && query?.search) {
      search = query?.search;
      delete query?.search;
    }

    const response = await this.service.getAllPainels(search);

    const filterPainels = response.filter((value) => value?.inUse);

    if (!filterPainels)
      throw new BadRequestException(
        'Não foi possível encontrar nenhum painel.',
      );

    const data = await Promise.all(
      filterPainels?.map(async (value) => {
        const response = await this.service.getAllContents({
          painelId: value?.id,
        });

        return {
          painelName: value?.name,
          painelId: value?.id,
          contents: response.map((value) => ({
            id: value?.id,
            orderExp: value?.orderExp,
            uri: value?.uri,
            title: value?.title,
          })),
        };
      }),
    );

    const formatedData = data?.map((value) => ({
      painelTitle: value?.painelName,
      painelId: value?.painelId,
      contents: value?.contents?.map((value) => {
        const parsedUrl = parse(value?.uri);
        const domain = parsedUrl.hostname;
        const path = parsedUrl.pathname.substring(
          0,
          parsedUrl.pathname.lastIndexOf('/') + 1,
        );
        const file = parsedUrl.pathname.substring(
          parsedUrl.pathname.lastIndexOf('/') + 1,
        );

        return {
          id: value?.id,
          orderExp: value?.orderExp,
          uri: {
            domain,
            path,
            file,
          },
          title: value?.title,
        };
      }),
    }));

    return formatedData;
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

  @Post(':id')
  @UseInterceptors(new ResponseInterceptor('Painel atualizado com sucesso.'))
  async editPainel(@Body() body: any) {
    const { painelId, painelTitle, contents } = body;

    const response = await this.service.editPainelsName(
      { id: painelId },
      { name: painelTitle },
    );

    if (!response)
      throw new BadRequestException('Não foi possível atualizar o seu painel.');

    if (contents) {
      await this.service.deletePastPainels(Number(painelId));

      for await (const content of contents) {
        const data: Partial<Painels> = {
          orderExp: content?.orderExp,
          uri: content?.domain + content?.path + content?.file,
          title: content?.title,
          painelId,
          painelTitle,
        };

        await this.service.createContents(data);
      }
    }

    return;
  }
}
