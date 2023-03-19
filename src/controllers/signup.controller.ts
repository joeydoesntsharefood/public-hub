import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/services/auth.service';
import { AvatarService } from 'src/services/avatar.service';
import { UserService } from 'src/services/user.service';
import { ResponseInterceptor } from '../interceptors/user.interceptor';

@Controller('unauth/signup')
export class SignupController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly avatarService: AvatarService,
  ) {}

  @Post('')
  @UseInterceptors(new ResponseInterceptor('Criamos seu usuário.'))
  async signup(@Body() body: any) {
    const {
      email,
      password,
      areaOfIntrest,
      chain,
      corp,
      lastName,
      name,
      occupation,
      phone,
      role,
      corpEmail,
      instituition,
      partOf,
    } = body;

    const verifyEmail = await this.userService.findOne({ email });

    if (verifyEmail)
      throw new NotFoundException('Esse e-mail já está cadastrado');

    const passwordHash = await this.authService.generateHash(password);

    const verificationToken = await this.authService.generateRandomNumber();

    const rpmId = await this.avatarService.create('');

    const userData: Partial<User> = {
      acceptTerms: false,
      accessLevel: 0,
      areaOfIntrest,
      chain,
      corp,
      corpEmail: corpEmail ?? '',
      email,
      firstAccess: true,
      instituition: instituition ?? '',
      lastName,
      name,
      occupation,
      passwordHash,
      passwordSalt: 10,
      phone,
      role,
      rpmId: rpmId?.id,
      partOf: partOf ?? false,
      verificationToken,
      verifiedAt: '',
      passwordResetToken: '',
      resetTokenExpires: '',
    };

    const response = await this.userService.createUser(userData);

    if (!response) throw new BadRequestException('Ocorreu algo de errado.');

    return;
  }
}
