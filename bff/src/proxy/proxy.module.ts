import { Module, forwardRef } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { HttpModule } from '@nestjs/axios';
import { ProxyController } from './proxy/proxy.controller';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule, forwardRef(() => AuthModule)],
  providers: [ProxyService],
  exports: [ProxyService],
  controllers: [ProxyController],
})
export class ProxyModule {}
