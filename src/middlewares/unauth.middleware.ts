import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from 'src/utils/logger.utils';

@Injectable()
export class UnAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    logger({ modules: 'UnAuth', req, res });
    next();
  }
}
