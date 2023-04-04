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
import { UserService } from 'src/services/user.service';
import { ResponseInterceptor } from '../interceptors/user.interceptor';
import { z } from 'zod';
import { User } from 'src/entities/user.entity';
import { AvatarService } from 'src/services/avatar.service';
import { AuthService } from 'src/services/auth.service';
import { MailerConsumer } from 'src/consumers/mailer.consumer';

@Controller('auth/user')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly avatarService: AvatarService,
    private readonly authService: AuthService,
  ) {}

  @Get(':id')
  @UseInterceptors(
    new ResponseInterceptor<any>('Encontramos o dado solicitado.'),
  )
  async getuser(@Param('id') id: string): Promise<any> {
    const response = await this.service.findOne({ id: Number(id) });

    if (!response)
      throw new BadRequestException(
        'Não foi possível encontrar o usuário solicitado',
      );

    return response;
  }

  @Post(':id')
  @UseInterceptors(new ResponseInterceptor<any>('Usuário editado com sucesso.'))
  async edituser(@Param('id') id: string, @Body() body: any): Promise<any> {
    const response = await this.service.editUser(body, Number(id));

    if (!response)
      throw new BadRequestException('Não foi possível editar o seu usuário.');

    return id;
  }

  @Post(':id/delete')
  @UseInterceptors(new ResponseInterceptor<any>('Encontramos o seu evento.'))
  async deleteuser(@Param('id') id: string): Promise<any> {
    return id;
  }

  @Get('')
  @UseInterceptors(
    new ResponseInterceptor<any>('Encontramos os seguintes usuários.'),
  )
  async getusers(@Query() query: any): Promise<any> {
    let search;
    let startAt;
    let endAt;
    let name;
    let lastName;
    let firstAccess;
    let partOf;

    if (query && query?.search) {
      if (query?.search.replace(' ', '').length < query?.search.length) {
        const fullName = query?.search.split(' ');
        name = fullName[0];
        lastName = fullName[1];
      } else search = query?.search;

      delete query?.search;
    }

    if (query && query?.firstAccess) {
      firstAccess = query?.firstAccess === 'true' ?? false;
      delete query?.firstAccess;
    }

    if (query && query?.startAt) {
      startAt = query?.startAt;
      delete query?.startAt;
    }

    if (query && query?.endAt) {
      endAt = query?.endAt;
      delete query?.endAt;
    }

    if (query && query?.partOf) {
      partOf = query?.partOf === 'true' ?? false;
      delete query?.partOf;
    }

    const selectColumns: Array<string> = [
      'user.id',
      'user.firstAccess',
      'user.name',
      'user.phone',
      'user.areaOfIntrest',
      'user.partOf',
      'user.email',
      'user.corpEmail',
      'user.corp',
      'user.role',
      'user.acceptTerms',
      'user.instituition',
      'user.lastName',
      'user.occupation',
      'user.chain',
      'user.verifiedAt',
      'user.accessLevel',
    ];

    const response = await this.service.getAll({
      endAt,
      query: { ...query, name, lastName, firstAccess, partOf },
      search,
      startAt,
      selectColumns,
    });

    if (!Array.isArray(response))
      throw new BadRequestException(
        'Não foi possível encontrar nenhum usuário.',
      );

    return response;
  }

  @Post('')
  @UseInterceptors(
    new ResponseInterceptor<any>('O pré cadastro foi criado com sucesso.'),
  )
  async createuser(@Body() body: any): Promise<any> {
    const createUserScheme = z.object({
      name: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      phone: z.string(),
      accessLevel: z.number(),
      instituition: z.string(),
    });

    const validateBody = createUserScheme.parse(body);

    if (!validateBody) throw new BadRequestException('Dados invalidos.');

    const { accessLevel, email, lastName, name, phone, instituition } =
      validateBody;

    const rpmLink = await this.avatarService.create('');

    if (!rpmLink?.id)
      throw new BadRequestException('Não conseguimos gerar o seu cadastro.');

    const verificationToken = this.authService.generateRandomNumber();

    const data: Omit<User, 'id'> = {
      acceptTerms: false,
      accessLevel,
      areaOfIntrest: '',
      chain: '',
      corp: '',
      corpEmail: '',
      email,
      firstAccess: true,
      instituition,
      lastName,
      name,
      phone,
      occupation: '',
      partOf: true,
      passwordHash: '',
      passwordResetToken: '',
      passwordSalt: 10,
      resetTokenExpires: '',
      role: '',
      rpmId: rpmLink?.id,
      verificationToken,
      verifiedAt: '',
      cpf: '',
    };

    const response = await this.service.createUser(data);

    const mailerConsumer = new MailerConsumer();

    if (!response)
      throw new BadRequestException('Não foi possível criar pré cadastro.');

    const mailer = await mailerConsumer.sendConfirmationToken({
      to: email,
      name: name + lastName,
      code: verificationToken,
    });

    if (!mailer)
      throw new BadRequestException(
        'Não foi possível enviar o e-mail de confirmação.',
      );

    return;
  }
}
