import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { HttpModule } from '@nestjs/axios';
import { ProxyController } from './proxy/proxy.controller';

@Module({
  imports: [HttpModule],
  providers: [ProxyService],
  exports: [ProxyService],
  controllers: [ProxyController],
})
export class ProxyModule {}
