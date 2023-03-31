import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import { ResponseInterceptor } from '../interceptors/user.interceptor';

@Controller('unauth/signin')
export class SigninController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('')
  @UseInterceptors(new ResponseInterceptor('Autenticamos seus dados.'))
  async signin(@Body() body: any) {
    const { email, password } = body;

    const response = await this.userService.findOne({ email });

    if (!response)
      throw new NotFoundException('Por favor insira dados validos.');

    const auth = await this.authService.verification(
      password,
      response?.passwordHash,
    );

    if (!auth) throw new NotFoundException('Não foi possível seu dados.');

    const verificationToken = await this.authService.generateToken(
      String(response?.id),
    );

    const responseEdit = await this.userService.editUser(
      { verificationToken },
      response?.id,
    );

    if (!responseEdit)
      throw new NotFoundException('Não foi possível registrar seu token.');

    const returnData: Partial<User> = {
      accessLevel: response?.accessLevel,
      chain: response?.chain,
      corp: response?.corp,
      corpEmail: response?.corpEmail,
      id: response?.id,
      name: response?.name,
      lastName: response?.lastName,
      role: response?.role,
      firstAccess: response?.firstAccess,
      partOf: response?.partOf,
      verificationToken,
    };

    return returnData;
  }
}
