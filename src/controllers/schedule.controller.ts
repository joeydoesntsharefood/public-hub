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
import { ScheduleService } from 'src/services/schedule.service';
import { z } from 'zod';
import { ResponseInterceptor } from '../interceptors/user.interceptor';

@Controller('auth/schedule')
export class ScheduleController {
  constructor(private readonly service: ScheduleService) {}

  @Get(':id')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async getSchedule(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Post(':id')
  @UseInterceptors(new ResponseInterceptor<any>('Editamos o seu evento.'))
  async editSchedule(@Param('id') id: string, @Body() body: any): Promise<any> {
    const response = await this.service.editSchedule(body, Number(id));

    if (!response)
      throw new BadRequestException('Não foi possível editar o evento.');

    return;
  }

  @Post(':id/user/:user')
  @UseInterceptors(
    new ResponseInterceptor<any>('Registramos sua participação no seu evento.'),
  )
  async addInvite(@Param() params: any): Promise<any> {
    const scheduleData = await this.service.findOne({ id: params?.id });

    if (!scheduleData)
      throw new BadRequestException('Não foi possível editar o evento.');

    const participatedUsers = [
      ...scheduleData?.participatedUsers.split(','),
      params?.user,
    ];

    const response = await this.service.editSchedule(
      { participatedUsers: String(participatedUsers) },
      Number(params?.id),
    );

    if (!response)
      throw new BadRequestException('Registrar sua entrada no evento.');

    return;
  }

  @Post(':id/delete')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async deleteSchedule(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Get('')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async getSchedules(@Query() query: any): Promise<any> {
    const response = await this.service.getAll(query);

    return response;
  }

  @Post('')
  @UseInterceptors(new ResponseInterceptor<any>('Criamos o seu evento.'))
  async createSchedule(@Body() body: any): Promise<any> {
    const createScheduleSchema = z.object({
      chain: z.string(),
      eventName: z.string(),
      hostId: z.string().email(),
      invitesId: z.string(),
      isEventOpen: z.boolean(),
      ownerId: z.number(),
      placeId: z.number(),
      placeName: z.string(),
      startAt: z.string(),
      endAt: z.string(),
    });

    const validateBody = createScheduleSchema.parse(body);

    if (!validateBody)
      throw new BadRequestException('Não foi possível criar o seu evento.');

    const response = await this.service.createSchedule(body);

    if (!response)
      throw new BadRequestException('Não foi possível criar o seu evento.');

    return;
  }
}
