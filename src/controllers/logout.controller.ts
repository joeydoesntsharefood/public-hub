import {
  BadGatewayException,
  Controller,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptors/user.interceptor';
import { UserService } from 'src/services/user.service';

@Controller('auth/logout')
export class LogoutController {
  constructor(private readonly userService: UserService) {}

  @Post(':id')
  @UseInterceptors(new ResponseInterceptor('Você saiu da plataforma admin.'))
  async logout(@Param('id') id: string) {
    const response = await this.userService.editUser(
      { seasonDate: null },
      Number(id),
    );

    if (!response)
      throw new BadGatewayException(
        'Não foi possível deslogar da plataforma admin',
      );

    return;
  }
}
