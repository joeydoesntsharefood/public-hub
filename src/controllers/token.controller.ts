import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth/token')
export class TokenController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('refresh')
  async refreshToken(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const payload = await this.jwtService.verifyAsync(token);
    const newToken = this.jwtService.sign({ userId: payload.userId });
    return { token: newToken };
  }
}
