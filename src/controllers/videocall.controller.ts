import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { VideoCallService } from 'src/services/videocall.service';
import { ResponseInterceptor } from '../interceptors/user.interceptor';

@Controller('auth/videocall')
export class VideoCallController {
  constructor(private readonly service: VideoCallService) {}

  @Post('')
  @UseInterceptors(
    new ResponseInterceptor<any>('Criamos a sua video conferência.'),
  )
  async createVideoCall(@Body() body: any): Promise<any> {
    const { invitesId } = body;

    const response = await this.service.create(String(invitesId));

    if (!response)
      throw new BadRequestException(
        'Não foi possível criar sua video conferência.',
      );

    return;
  }

  @Get('hasvideocall/:id')
  @UseInterceptors(
    new ResponseInterceptor<any>('Encontramos um video conferência'),
  )
  async getVideoCall(@Param() params: { id: string }) {
    const response = await this.service.findOne(params?.id);

    if (!response)
      throw new BadRequestException(
        'Não foi possivel encontrar nenhuma video conferência.',
      );

    return { id: response };
  }
}
