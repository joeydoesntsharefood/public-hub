import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptors/user.interceptor';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

@Controller('unauth/forget')
export class ForgetController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('password')
  @UseInterceptors(
    new ResponseInterceptor(
      'Enviamos um e-mail de com um código de verificação.',
    ),
  )
  async forgetPassword(@Body() body: any) {
    const { email } = body;

    const userData = await this.userService.findOne({ email });

    if (!userData)
      throw new BadRequestException(
        'Não foi possível encontrar os seus dados.',
      );

    const passwordResetToken = await this.authService.generateRandomNumber();

    const saveToken = await this.userService.editUser(
      { passwordResetToken },
      userData?.id,
    );

    if (!saveToken)
      throw new BadRequestException(
        'Não foi possível amarzenar o seu código de verificação.',
      );

    return;
  }

  @Post('verificate')
  @UseInterceptors(new ResponseInterceptor('Código de verificação válido.'))
  async verificate(@Body() body: any) {
    const { email, code } = body;

    const userData = await this.userService.findOne({ email });

    if (!userData)
      throw new BadRequestException('Não foi possível encontrar o seu e-mail.');

    if (userData?.passwordResetToken !== code)
      throw new BadRequestException('Código de verificação invalido.');

    return;
  }

  @Post('newpassword')
  @UseInterceptors(new ResponseInterceptor('Senha atualizada.'))
  async newPassword(@Body() body: any) {
    const { newPassword, email, code } = body;

    const userData = await this.userService.findOne({ email });

    if (!userData)
      throw new BadRequestException('Não foi possível encontrar o seu e-mail.');

    if (userData?.passwordResetToken !== code)
      throw new BadRequestException('Código de verificação invalido.');

    const passwordHash = await this.authService.generateHash(newPassword);

    const editResponse = await this.userService.editUser(
      { passwordHash },
      userData?.id,
    );

    if (!editResponse)
      throw new BadRequestException('Não foi amarzenar sua nova senha.');

    return;
  }
}
