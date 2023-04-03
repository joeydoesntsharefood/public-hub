import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptors/user.interceptor';
import { ContentService } from 'src/services/content.service';
import { DeveloperService } from 'src/services/developer.service';

@Controller('auth/developer')
export class DeveloperController {
  constructor(
    private readonly service: DeveloperService,
    private readonly contentServices: ContentService,
  ) {}

  @Post('/create/painels')
  @UseInterceptors(new ResponseInterceptor<any>('Painels solicitados criados.'))
  async createPainels(@Body() body: any) {
    const { total } = body;

    const ids = [];

    for (let i = 0; i <= total; i++) ids.push(i);

    console.log('Começarei a criar os painels');

    for await (const i of ids) {
      console.log(`Painel de número: ${i}`);

      await this.contentServices.createPainel({ inUse: false, name: '' });
    }

    console.log('Terminei de criar os painels: ');

    return;
  }
}
