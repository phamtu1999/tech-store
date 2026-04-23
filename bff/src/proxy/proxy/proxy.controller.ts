import { Controller, All, Req, Res, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

import { ProxyService } from '../proxy.service';
import { AuthService } from '../../auth/auth.service';
import { toSnakeCase } from '../../common/utils/case-converter';

@Controller('api/v1')

export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);

  constructor(
    private readonly proxyService: ProxyService,
    private readonly authService: AuthService,
  ) {}

  @All(':path*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const path = req.originalUrl;
    
    // Skip auth endpoints as they are handled by AuthController
    if (path.startsWith('/api/v1/auth')) {
      return;
    }

    const sessionId = req.cookies['sessionId'];
    const headers = { ...req.headers };
    
    if (sessionId) {
      const session = await this.authService.getSession(sessionId);
      if (session && session.token) {
        headers['Authorization'] = `Bearer ${session.token}`;
        this.logger.debug(`Attached JWT for session: ${sessionId}`);
      }
    }

    const response = await this.proxyService.forward(
      req.method,
      path,
      toSnakeCase(req.body),
      headers,
      req.query,
    );


    // Forward status code and data
    return res.status(response.status).json(response.data);
  }
}
