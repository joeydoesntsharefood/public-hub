import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor } from 'src/interceptors/user.interceptor';

@Controller('users')
export class UserController {
  private users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ];

  @Get(':id')
  @UseInterceptors(new ResponseInterceptor<any>('Teste'))
  async getUser(@Param('id') id: string) {
    const user = this.users.find((user) => user.id === +id);
    if (!user) throw new HttpException('U ser not found', HttpStatus.NOT_FOUND);
    return user;
  }
}
