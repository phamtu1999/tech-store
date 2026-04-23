import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ProxyService } from '../proxy/proxy.service';
import { randomUUID } from 'node:crypto';
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => ProxyService))
    private readonly proxyService: ProxyService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async authenticate(loginDto: any) {
    console.log(`[Auth] Step 1: Forwarding login request to Backend...`);
    const response = await this.proxyService.forward(
      'POST',
      '/api/v1/auth/authenticate',
      loginDto,
    );
    console.log(`[Auth] Step 2: Backend responded with status: ${response.status}`);

    if (response.status !== 200) {
      console.log(`[Auth] Login failed at Backend: ${JSON.stringify(response.data)}`);
      throw new UnauthorizedException(response.data?.message || 'Authentication failed');
    }

    const { token, ...user } = response.data.result;
    const sessionId = randomUUID();
    console.log(`[Auth] Step 3: Successfully authenticated. Creating session: ${sessionId}`);

    // Store JWT and user info in Redis (expires in 1 day)
    console.log(`[Auth] Step 4: Storing session in Redis...`);
    await this.cacheManager.set(
      `session:${sessionId}`,
      { token, user },
      86400000, // 24 hours in ms
    );
    console.log(`[Auth] Step 5: Session stored successfully!`);

    // Return user with token for frontend Redux/LocalStorage compatibility
    return { sessionId, user: { ...user, token } };
  }

  async logout(sessionId: string) {
    await this.cacheManager.del(`session:${sessionId}`);
  }

  async getSession(sessionId: string) {
    return await this.cacheManager.get<any>(`session:${sessionId}`);
  }
}
