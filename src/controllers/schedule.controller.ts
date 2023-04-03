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
import { MailerConsumer } from 'src/consumers/mailer.consumer';

@Controller('auth/schedule')
export class ScheduleController {
  constructor(private readonly service: ScheduleService) {}

  @Get(':id')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async getSchedule(@Param('id') id: string): Promise<any> {
    const response = await this.service.findOne({ id: Number(id) });

    if (!response)
      throw new BadRequestException(
        'Não foi possível encontrar o evento solicitado.',
      );

    return response;
  }

  @Post(':id')
  @UseInterceptors(new ResponseInterceptor<any>('Editamos o seu evento.'))
  async editSchedule(@Param('id') id: string, @Body() body: any): Promise<any> {
    const response = await this.service.editSchedule(body, Number(id));

    if (!response)
      throw new BadRequestException('Não foi possível editar o evento.');

    return;
  }

  @Post(':id/user')
  @UseInterceptors(
    new ResponseInterceptor<any>('Registramos sua participação no seu evento.'),
  )
  async addInvite(@Body() body: any, @Param('id') id: string): Promise<any> {
    const createParticipatedUsersSchema = z.object({
      participatedUsers: z.number().array(),
    });

    const { participatedUsers } = createParticipatedUsersSchema.parse(body);

    if (!participatedUsers)
      throw new BadRequestException(
        'Envia os dados dos usuários participantes.',
      );

    const participatedUsersConcat = String(participatedUsers);

    const response = await this.service.editSchedule(
      { participatedUsers: participatedUsersConcat },
      Number(id),
    );

    if (!response)
      throw new BadRequestException('Registrar sua entrada no evento.');

    return;
  }

  @Post(':id/delete')
  @UseInterceptors(new ResponseInterceptor<any>('Deletamos o seu evento.'))
  async deleteSchedule(@Param('id') id: string): Promise<any> {
    const response = await this.service.deleteSchedule(Number(id));

    if (!response)
      throw new BadRequestException(
        'Não foi possível deletar o evento solicitado.',
      );

    return;
  }

  @Get('')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async getSchedules(@Query() query: any): Promise<any> {
    let startAt;
    let endAt;
    let search;
    let isEventOpen;

    if (query && query?.startAt) {
      startAt = query?.startAt;
      delete query?.startAt;
    }

    if (query && query?.endAt) {
      endAt = query?.endAt;
      delete query?.endAt;
    }

    if (query && query?.search) {
      search = query?.search;
      delete query?.search;
    }

    if (query && query?.isEventOpen) {
      isEventOpen = query?.isEventOpen === 'true' ?? false;
      delete query?.isEventOpen;
    }

    const response = await this.service.getAll({
      query: { ...query, isEventOpen },
      endAt,
      startAt,
      search,
    });

    return response;
  }

  @Post('')
  @UseInterceptors(new ResponseInterceptor<any>('Criamos o seu evento.'))
  async createSchedule(@Body() body: any): Promise<any> {
    const createScheduleSchema = z.object({
      eventName: z.string(),
      hostId: z.string().email(),
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

    const {
      endAt,
      eventName,
      hostId,
      isEventOpen,
      ownerId,
      placeId,
      placeName,
      startAt,
    } = validateBody;

    const response = await this.service.createSchedule({
      endAt,
      eventName,
      hostId,
      isEventOpen,
      ownerId,
      placeId,
      placeName,
      startAt,
      chain: body?.chain ?? '',
      invitesId: String(body?.invitesId) ?? '',
    });

    const mailerConsumer = new MailerConsumer();

    const sendEmails = async (value) =>
      await mailerConsumer.sendInviteEvent({
        to: value,
        eventDate: startAt.split('T')[0],
        eventHour: startAt.split('T')[1],
        eventLocation: placeName,
        eventName,
      });

    if (Array.isArray(body?.invitesId))
      Promise.all(body?.invitesId.map(sendEmails));

    if (!response)
      throw new BadRequestException('Não foi possível criar o seu evento.');

    return;
  }
}
