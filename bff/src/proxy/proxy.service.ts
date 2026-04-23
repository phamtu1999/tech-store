import { Injectable, Logger, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private readonly backendUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.backendUrl = this.configService.get<string>('BACKEND_URL') || 'http://localhost:8080';
  }

  async forward(
    method: string,
    path: string,
    data?: any,
    headers?: any,
    params?: any,
  ): Promise<{ status: number; data: any }> {
    const url = `${this.backendUrl}${path}`;
    
    // Tạo cache key cho các request GET
    let cacheKey = null;
    if (method.toUpperCase() === 'GET') {
      const authHeader = headers?.Authorization || headers?.authorization || 'anonymous';
      const paramsString = params ? JSON.stringify(params) : '';
      cacheKey = `proxy_cache:${path}:${paramsString}:${authHeader}`;
      
      const cachedResponse = await this.cacheManager.get(cacheKey);
      if (cachedResponse) {
        this.logger.debug(`Cache HIT for: ${path}`);
        return cachedResponse as { status: number; data: any };
      }
    }

    // Clean up headers to avoid conflicts
    const cleanedHeaders = { ...headers };
    delete cleanedHeaders.host;
    delete cleanedHeaders.connection;

    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      headers: cleanedHeaders,
      params,
      // Important for passing through status codes instead of throwing
      validateStatus: () => true,
    };

    this.logger.debug(`Forwarding ${method} request to: ${url}`);
    
    try {
      const response = await firstValueFrom(this.httpService.request(config));
      const result = {
        status: response.status,
        data: response.data,
      };

      // Lưu cache 60 giây cho các request GET thành công (mili-giây đối với cache-manager v5)
      if (cacheKey && response.status >= 200 && response.status < 300) {
        await this.cacheManager.set(cacheKey, result, 60000);
        this.logger.debug(`Cache SET for: ${path}`);
      }

      return result;
    } catch (error) {
      this.logger.error(`Error forwarding request to backend: ${error.message}`);
      throw error;
    }
  }
}

