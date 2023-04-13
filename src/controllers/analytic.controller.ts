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
import { Analytics } from 'src/entities/analytics.entity';
import { ResponseInterceptor } from 'src/interceptors/user.interceptor';
import { AnalyticService } from 'src/services/analytic.service';

@Controller('auth/analytic')
export class AnalyticController {
  constructor(private readonly service: AnalyticService) {}

  @Post(':event')
  @UseInterceptors(new ResponseInterceptor('Foi possível registrar o evento.'))
  async registerEvent(
    @Param('event') event: string,
    @Body() body?: { location?: string; painelId: number },
  ) {
    const [now] = new Date().toJSON().split('.');
    const data: Partial<Analytics> = {
      date: now,
      type: event,
      location: body.location ?? '',
      painelId: body.painelId ?? 0,
    };

    const response = await this.service.createAnalytics(data);

    if (!response)
      throw new BadRequestException('Não foi possível amarzenar o evento.');

    return;
  }

  @Get('')
  @UseInterceptors(
    new ResponseInterceptor('Os dados dos eventos foram encontrados.'),
  )
  async getEvents(@Query() query: any) {
    let startAt;
    let endAt;

    if (query && query?.startAt) {
      startAt = query?.startAt;
      delete query?.startAt;
    }

    if (query && query?.endAt) {
      endAt = query?.endAt;
      delete query?.endAt;
    }

    const response = await this.service.getAnlytics({ startAt, endAt });

    if (!response)
      throw new BadRequestException(
        'Não foi possível encontrar os dados solicitados.',
      );

    const newUsers = response?.filter((value) => value.type === 'newUsers');

    const access = response?.filter((value) => value.type === 'access');

    const verifyUsers = response?.filter(
      (value) => value.type === 'verifyUsers',
    );

    const locations = response?.filter((value) => value.type === 'locations');

    const events: Array<{ type: string; value: number }> = [
      {
        type: 'Acesso a localizações',
        value: locations.length,
      },
      {
        type: 'Novos usuários',
        value: newUsers.length,
      },
      {
        type: 'Acessos',
        value: access.length,
      },
      {
        type: 'Usuários verificados',
        value: verifyUsers.length,
      },
      {
        type: 'Usuários cadastrados',
        value: newUsers.length,
      },
    ];

    const locationsFormated: Array<{ type: string; value: number }> = [
      {
        type: 'BRAB - Skyroom',
        value: locations.filter((value) => value.location === 'skyroom').length,
      },
      {
        type: 'BRAB - Espaço Mídia',
        value: locations.filter((value) => value.location === 'espacoMidia')
          .length,
      },
      {
        type: 'BRAB - Rodada de negócios',
        value: locations.filter((value) => value.location === 'rodada').length,
      },
      {
        type: 'BRAB - Oficinas do futuro',
        value: locations.filter((value) => value.location === 'oficinas')
          .length,
      },
      {
        type: 'Sala de reunião instituicional 1',
        value: locations.filter(
          (value) => value.location === 'salaInstituicional1',
        ).length,
      },
      {
        type: 'Sala de reunião instituicional 2',
        value: locations.filter(
          (value) => value.location === 'salaInstituicional2',
        ).length,
      },
      {
        type: 'Sala de reunião instituicional 3',
        value: locations.filter(
          (value) => value.location === 'salaInstituicional3',
        ).length,
      },
      {
        type: 'Sala de reunião instituicional 4',
        value: locations.filter(
          (value) => value.location === 'salaInstituicional4',
        ).length,
      },
      {
        type: 'Audititório institucional 1',
        value: locations.filter(
          (value) => value.location === 'audInstituicional1',
        ).length,
      },
      {
        type: 'Audititório institucional 2',
        value: locations.filter(
          (value) => value.location === 'audInstituicional2',
        ).length,
      },
      {
        type: 'Audititório institucional 3',
        value: locations.filter(
          (value) => value.location === 'audInstituicional3',
        ).length,
      },
      {
        type: 'Audititório institucional 4',
        value: locations.filter(
          (value) => value.location === 'audInstituicional4',
        ).length,
      },
      {
        type: 'Meeting Room',
        value: locations.filter((value) => value.location === 'meetingRoom')
          .length,
      },
      {
        type: 'Arena Agriland',
        value: locations.filter((value) => value.location === 'arena').length,
      },
    ];

    const formatData = {
      events,
      locations: locationsFormated,
      accessForDays: access,
      accessForMonth: [],
      newUsers,
      verifyUsers,
      map: [],
    };

    return formatData;
  }
}
