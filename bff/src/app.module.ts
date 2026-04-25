import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { redisStore } from 'cache-manager-ioredis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyModule } from './proxy/proxy.module';
import { AuthModule } from './auth/auth.module';

@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const url = configService.get('REDIS_URL');
        const host = configService.get('REDIS_HOST');
        const port = configService.get('REDIS_PORT', 6379);
        const password = configService.get('REDIS_PASSWORD');
        
        const redisOptions = {
          enableOfflineQueue: false,
          connectTimeout: 10000,
          maxRetriesPerRequest: 0, // Critical for avoiding Unhandled Error Event in some scenarios
          retryStrategy: (times: number) => {
            const delay = Math.min(times * 100, 3000);
            return delay;
          },
        };
        
        try {
          if (url) {
            console.log(`[Redis] Connecting using URL...`);
            return {
              store: await redisStore({
                url: url,
                ...redisOptions,
                ttl: 3600000,
              })
            };
          }

          if (host && host !== 'localhost' && host !== '127.0.0.1') {
            console.log(`[Redis] Connecting via host/port ${host}:${port}...`);
            return {
              store: await redisStore({
                host,
                port,
                password,
                ...redisOptions,
                ttl: 3600000,
              })
            };
          }
        } catch (e) {
          console.error('[Redis] Failed to initialize Redis store:', e.message);
        }

        console.warn(
          '[Redis] Falling back to in-memory cache. Sessions and cache will reset on restart.',
        );
        return {
          ttl: 3600000,
        };
      },
      inject: [ConfigService],
    }),

    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    AuthModule,
    ProxyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
