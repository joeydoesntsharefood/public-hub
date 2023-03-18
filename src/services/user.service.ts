import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getHello(id: string): number {
    return Number(id);
  }
}
