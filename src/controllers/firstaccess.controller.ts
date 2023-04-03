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

@Controller('unauth/admin')
export class FirstAccessController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('verify')
  @UseInterceptors(new ResponseInterceptor('Código validado com sucesso.'))
  async verify(@Body() body: any) {
    const { code, email } = body;

    const userData = await this.userService.findOne({
      email,
      verificationToken: code,
    });

    if (!userData)
      throw new BadRequestException(
        'Não foi possível validar o seu código ou e-mail, verifique se estão corretos.',
      );

    return;
  }

  @Post('password')
  @UseInterceptors(new ResponseInterceptor('Senha de acesso registrada.'))
  async setPassword(@Body() body: any) {
    const { password, code, email } = body;

    const userData = await this.userService.findOne({
      email,
      verificationToken: code,
    });

    if (!userData)
      throw new BadRequestException(
        'Não foi possível validar o seu código ou e-mail, verifique se estão corretos.',
      );

    const passwordHash = await this.authService.generateHash(password);

    const [now] = new Date().toJSON().split('.');

    const response = await this.userService.editUser(
      { passwordHash, verifiedAt: now },
      userData?.id,
    );

    if (!response)
      throw new BadRequestException(
        'Não foi possíve alterar sua senha. Tente novamente mais tarde.',
      );

    return;
  }
}
