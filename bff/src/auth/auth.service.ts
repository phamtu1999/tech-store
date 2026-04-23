import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ProxyService } from '../proxy/proxy.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly proxyService: ProxyService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async authenticate(loginDto: any) {
    const response = await this.proxyService.forward(
      'POST',
      '/api/v1/auth/authenticate',
      loginDto,
    );

    if (response.status !== 200) {
      throw new UnauthorizedException(response.data?.message || 'Authentication failed');
    }

    const { token, ...user } = response.data.result;
    const sessionId = uuidv4();

    // Store JWT and user info in Redis (expires in 1 day)
    await this.cacheManager.set(
      `session:${sessionId}`,
      { token, user },
      86400000, // 24 hours in ms
    );

    return { sessionId, user };
  }

  async logout(sessionId: string) {
    await this.cacheManager.del(`session:${sessionId}`);
  }

  async getSession(sessionId: string) {
    return await this.cacheManager.get<any>(`session:${sessionId}`);
  }
}
