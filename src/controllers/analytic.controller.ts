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
import { countCity } from 'src/utils/countCity';
import { countDay } from 'src/utils/countDay';
import { getIntersectingMonths } from 'src/utils/getIntersectingMonths';
import { newDate } from 'src/utils/newDate';
import translateMonths from 'src/utils/translate.months';

@Controller('auth/analytic')
export class AnalyticController {
  constructor(private readonly service: AnalyticService) {}

  @Post(':event')
  @UseInterceptors(new ResponseInterceptor('Foi possível registrar o evento.'))
  async registerEvent(
    @Param('event') event: string,
    @Body() body?: { location?: string; painelId: number },
  ) {
    const date = newDate();

    const data: Partial<Analytics> = {
      date,
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

    const convertObjectDateToStringDate = (value: string) =>
      new Date(value).toISOString();

    const formatEvents = ({ date, type }: { type: string; date: string }) => ({
      type,
      date,
    });

    const newUsers = response
      ?.filter((value) => value.type === 'newUsers')
      .map(formatEvents);

    const access = response?.filter((value) => value.type === 'access');

    const verifyUsers = response
      ?.filter((value) => value.type === 'verifyUsers')
      ?.map(formatEvents);

    const ambiences = response?.filter((value) => value.type === 'ambiences');

    const locations = response?.filter((value) => value.type === 'locations');

    const events: Array<{ type: string; value: number }> = [
      {
        type: 'Acesso a ambientes',
        value: ambiences.length,
      },
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
        type: 'Espaço Agribusiness (BRAB)',
        value: locations.filter((value) => value.location === '1').length,
      },
      {
        type: 'Cadeia Algodão',
        value: locations.filter((value) => value.location === '2').length,
      },
      {
        type: 'Cadeia Aves',
        value: locations.filter((value) => value.location === '3').length,
      },
      {
        type: 'Cadeia Bovina',
        value: locations.filter((value) => value.location === '4').length,
      },
      {
        type: 'Cadeia Cacau',
        value: locations.filter((value) => value.location === '5').length,
      },
      {
        type: 'Cadeia Café',
        value: locations.filter((value) => value.location === '6').length,
      },
      {
        type: 'Cadeia Cana',
        value: locations.filter((value) => value.location === '7').length,
      },
      {
        type: 'Cadeia Leite',
        value: locations.filter((value) => value.location === '8').length,
      },
      {
        type: 'Cadeia Pescado',
        value: locations.filter((value) => value.location === '9').length,
      },
      {
        type: 'Cadeia Soja',
        value: locations.filter((value) => value.location === '10').length,
      },
      {
        type: 'Cadeia Suína',
        value: locations.filter((value) => value.location === '11').length,
      },
      {
        type: 'Pescaria',
        value: locations.filter((value) => value.location === '12').length,
      },
      {
        type: 'Institucional 1',
        value: locations.filter((value) => value.location === '13').length,
      },
      {
        type: 'Institucional 2',
        value: locations.filter((value) => value.location === '14').length,
      },
      {
        type: 'Institucional 3',
        value: locations.filter((value) => value.location === '15').length,
      },
      {
        type: 'Institucional 4',
        value: locations.filter((value) => value.location === '16').length,
      },
    ];

    const [year, month] = endAt ? endAt.split('-') : startAt.split('-');

    const formatMonth = (month: number): string =>
      month.toString().padStart(2, '0');

    const lastMonths = ({
      month,
      year,
      totalMonths,
    }: {
      month: number;
      year: number;
      totalMonths?: number;
    }): string[] => {
      const date = new Date(year, month - 1, 1);
      date.setFullYear(date.getFullYear() - (month < 5 ? 1 : 0));

      let currentYear = year;

      const months = Array.from({ length: totalMonths ?? 5 }, (_, i) => {
        const lastMonth = ((((month - 1 - i) % 12) + 12) % 12) + 1;

        if (lastMonth === 12) currentYear--;

        return `${formatMonth(lastMonth)}-${currentYear}`;
      });

      return months;
    };

    let totalMonths = 5;

    if (startAt && endAt) {
      const intersectingMonths = getIntersectingMonths({ startAt, endAt });
      if (intersectingMonths.length > 1)
        totalMonths = intersectingMonths.length;
    }

    const months = lastMonths({
      month: Number(month),
      year: Number(year),
      totalMonths,
    });

    const accessForMonth: Array<{ type: string; value: number }> = months.map(
      (monthAndYear: string) => {
        const [month, year] = monthAndYear.split('-');

        const value = access.filter((value) => {
          const dateString = convertObjectDateToStringDate(value?.date);
          const [date] = dateString.split('T');
          const [year, month] = date.split('-');

          if (`${month}-${year}` === monthAndYear) return value;
        }).length;

        return { type: `${translateMonths[month]}/${year}`, value };
      },
    );

    const accessCount = countDay(
      access.map((value) => {
        const [date] = convertObjectDateToStringDate(value?.date).split('T');

        return date;
      }),
    );

    const accessForDays = Object.entries(accessCount).map((value) => ({
      type: value?.[0],
      value: value?.[1],
    }));

    const newUsersCount = countDay(
      newUsers.map((value) => {
        const [date] = convertObjectDateToStringDate(value?.date).split('T');

        return date;
      }),
    );

    const newUserForDays = Object.entries(newUsersCount).map((value) => ({
      type: value?.[0],
      value: value?.[1],
    }));

    const verifyUsersCount = countDay(
      verifyUsers.map((value) => {
        const [date] = convertObjectDateToStringDate(value?.date).split('T');

        return date;
      }),
    );

    const verifyUsersForDays = Object.entries(verifyUsersCount).map(
      (value) => ({
        type: value?.[0],
        value: value?.[1],
      }),
    );

    const mapCount = countCity(access.map((value) => value?.location));

    const mapForCitys = Object.entries(mapCount).map((value) => ({
      type: value?.[0],
      value: value?.[1],
    }));

    const ambiencesFormated: Array<{ type: string; value: number }> = [
      {
        type: 'BRAB - Skyroom',
        value: ambiences.filter((value) => value.location === '1').length,
      },
      {
        type: 'BRAB - Espaço Mídia',
        value: ambiences.filter((value) => value.location === '3').length,
      },
      {
        type: 'BRAB - Rodada de negócios',
        value: ambiences.filter((value) => value.location === '2').length,
      },
      {
        type: 'BRAB - Oficinas do futuro',
        value: ambiences.filter((value) => value.location === '4').length,
      },
      {
        type: 'Sala de reunião instituicional 1',
        value: ambiences.filter((value) => value.location === '7').length,
      },
      {
        type: 'Audititório institucional 1',
        value: ambiences.filter((value) => value.location === '8').length,
      },
      {
        type: 'Meeting Room',
        value: ambiences.filter((value) => value.location === '6').length,
      },
      {
        type: 'Arena Agriland',
        value: ambiences.filter((value) => value.location === '5').length,
      },
    ];

    const filterNoValue = (value: { type: string; value: number }) =>
      value.value !== 0;

    const formatData = {
      events: events.filter(filterNoValue),
      ambiences: ambiencesFormated.filter(filterNoValue),
      locations: locationsFormated.filter(filterNoValue),
      accessForDays: accessForDays.filter(filterNoValue),
      accessForMonth: accessForMonth.filter(filterNoValue),
      newUsers: newUserForDays.filter(filterNoValue),
      verifyUsers: verifyUsersForDays.filter(filterNoValue),
      map: mapForCitys.filter(filterNoValue),
    };

    return formatData;
  }
}
