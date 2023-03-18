import { RouteInfo } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { green, yellow, cyan, bold, red } from 'chalk';
import { timerLogger } from './timerLogger.utils';
import { _module } from 'src/types/modules.type';

interface Props {
  res: Response;
  req: Request;
  modules: _module;
}

const logger = ({ modules, req, res }: Props) => {
  const { method, path } = req;
  const start = Date.now();
  res.on('finish', () => {
    const { statusCode } = res;
    const contentLength = res.get('content-length');
    const route: RouteInfo = req['route'];
    const controllerName = route?.path.split('/')[1] ?? 'unknown';
    const formattedPath = route?.path ?? path;
    const logColor = (value: string) =>
      statusCode >= 500
        ? red(value)
        : statusCode >= 400
        ? yellow(value)
        : green(value);

    const infos = `${logColor(method)} ${bold(
      formattedPath,
    )} - ${statusCode} ${contentLength} - ${Date.now() - start}ms - ${cyan(
      controllerName,
    )}`;
    timerLogger({ infos, modules });
  });
};

export { logger };
