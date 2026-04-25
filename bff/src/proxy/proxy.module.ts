import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import * as http from 'http';
import * as https from 'https';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy/proxy.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
      httpAgent: new http.Agent({ keepAlive: true, maxSockets: 100 }),
      httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 100 }),
    }),
    forwardRef(() => AuthModule),
  ],
  providers: [ProxyService],
  exports: [ProxyService],
  controllers: [ProxyController],
})
export class ProxyModule {}
