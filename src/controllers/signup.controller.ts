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
import { MailerConsumer } from 'src/consumers/mailer.consumer';
import { z } from 'zod';

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
    const createSignupSchema = z.object({
      email: z
        .string({
          invalid_type_error: 'O valor não é uma string.',
          required_error: 'Enviar um e-mail valida.',
        })
        .email(),
      password: z.string({
        invalid_type_error: 'O valor não é uma string.',
        required_error: 'Enviar uma senha valida.',
      }),
      areaOfIntrest: z.string({
        invalid_type_error: 'O valor não é uma string.',
        required_error: 'Enviar alguma area de interesse.',
      }),
      chain: z.string({
        invalid_type_error: 'O valor não é uma string.',
        required_error: 'Enviar uma cadeia.',
      }),
      corp: z.string({
        invalid_type_error: 'O valor não é uma string.',
        required_error: 'Enviar uma corporação.',
      }),
      lastName: z.string({
        invalid_type_error: 'O valor não é uma string.',
        required_error: 'Enviar um sobrenome.',
      }),
      name: z.string({
        invalid_type_error: 'O valor não é uma string.',
        required_error: 'Enviar um nome.',
      }),
      occupation: z.string({
        invalid_type_error: 'O valor não é uma string',
        required_error: 'Enviar uma ocupação.',
      }),
      phone: z.string({
        invalid_type_error: 'O valor inserido não é uma string',
        required_error: 'Enviar um telefone.',
      }),
      role: z.string({
        invalid_type_error: 'O valor inserido não é uma string',
        required_error: 'Enviar um cargo.',
      }),
      corpEmail: z.string({
        invalid_type_error: 'O valor inserido não é uma string',
        required_error: 'Enviar um E-mail.',
      }),
      instituition: z.string({
        invalid_type_error: 'O valor inserido não é uma string',
        required_error: 'Enviar uma instituição.',
      }),
      partOf: z.boolean({
        invalid_type_error: 'O valor não é um booleano',
        required_error: 'Enviar se o usuário faz parte do agro.',
      }),
      cpf: z.string({
        invalid_type_error: 'O valor inserido não é uma string.',
        required_error: 'Enviar o CPF do usuário.',
      }),
    });

    const validateBody = createSignupSchema.parse(body);

    const {
      areaOfIntrest,
      chain,
      corp,
      corpEmail,
      email,
      instituition,
      lastName,
      name,
      occupation,
      partOf,
      password,
      phone,
      role,
      cpf,
    } = validateBody;

    const verifyEmail = await this.userService.findOne({ email });

    if (verifyEmail)
      throw new NotFoundException('Esse e-mail já está cadastrado');

    const passwordHash = await this.authService.generateHash(password);

    const verificationToken = await this.authService.generateRandomNumber();

    const rpmId = await this.avatarService.create('');

    const userData: Partial<User> = {
      acceptTerms: false,
      accessLevel: 7,
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
      cpf,
    };

    const response = await this.userService.createUser(userData);

    if (!response) throw new BadRequestException('Ocorreu algo de errado.');

    const mailerConsumer = new MailerConsumer();

    const mailer = await mailerConsumer.sendConfirmationToken({
      name: name + lastName,
      to: email,
      code: verificationToken,
    });

    if (!mailer)
      throw new BadRequestException(
        'Ocorreu um erro ao enviar seu código de verificação',
      );

    return;
  }
}
