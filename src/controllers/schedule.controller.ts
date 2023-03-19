import { Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../interceptors/user.interceptor';

@Controller('schedule')
export class ScheduleController {
  @Get(':id')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async getSchedule(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Post(':id')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async editSchedule(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Post(':id/delete')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async deleteSchedule(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Get('')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async getSchedules(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Post('')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async createSchedule(@Param('id') id: string): Promise<any> {
    return id;
  }
}
