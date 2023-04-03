import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { ResponseInterceptor } from 'src/interceptors/user.interceptor';
import { UserService } from 'src/services/user.service';
import { z } from 'zod';

@Controller('auth/user/validate')
export class UserValidateController {
  constructor(private readonly userServices: UserService) {}

  @Post('/create/painels')
  @UseInterceptors(new ResponseInterceptor<any>('Código validado com sucesso.'))
  async validateConfirmationToken(@Body() body: any) {
    const createValidateTokenSchema = z.object({
      email: z.string({
        required_error: 'Enviar e-mail do usuário',
        invalid_type_error: 'O valor não é uma string.',
      }),
      code: z.string({
        required_error: 'Enviar o código de verificação',
        invalid_type_error: 'O valor não é uma string.',
      }),
    });

    const validateBody = createValidateTokenSchema.parse(body);

    const { code, email } = validateBody;

    const userData = await this.userServices.findOne({
      email,
      verificationToken: code,
    });

    if (!userData)
      throw new BadRequestException(
        'Não foi possivel validar as informações do usuários, inserir corretamente.',
      );

    const now = dayjs().format('YYYY-MM-DDTHH:mm');

    const response = await this.userServices.editUser(
      {
        verifiedAt: now,
        verificationToken: '',
      },
      userData?.id,
    );

    if (!response)
      throw new BadRequestException(
        'Usuário não foi possível amarzenar a validação do usuário.',
      );

    return;
  }
}
