import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private readonly backendUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.backendUrl = this.configService.get<string>('BACKEND_URL') || 'http://localhost:8080';
  }


  async forward(
    method: string,
    path: string,
    data?: any,
    headers?: any,
    params?: any,
  ): Promise<AxiosResponse> {
    const url = `${this.backendUrl}${path}`;
    
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
      return response;
    } catch (error) {
      this.logger.error(`Error forwarding request to backend: ${error.message}`);
      throw error;
    }
  }
}
