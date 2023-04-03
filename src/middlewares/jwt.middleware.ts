import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      const payload = await this.jwtService.verifyAsync(token);

      req['user'] = payload;
      next();
    } catch (err) {
      res
        .status(401)
        .json({ message: 'Usuário não autenticado.', success: false });
    }
  }
}
