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
        const isProduction = configService.get('NODE_ENV') === 'production';
        const url = configService.get('REDIS_URL');
        const host = configService.get('REDIS_HOST', 'localhost');
        const port = configService.get('REDIS_PORT', 6379);
        const password = configService.get('REDIS_PASSWORD');
        const isLoopbackHost = ['localhost', '127.0.0.1', '::1'].includes(host);
        const redisOptions = {
          enableOfflineQueue: false,
          connectTimeout: 5000,
          maxRetriesPerRequest: 3,
        };
        
        if (url) {
          console.log(`Connecting to Redis using URL...`);
          return {
            store: await redisStore({
              url: url,
              ...redisOptions,
              ttl: 3600000,
            })
          };
        }

        if (!isProduction || !isLoopbackHost) {
          console.log(`REDIS_URL not found, connecting to Redis via host/port ${host}:${port}...`);
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

        console.warn(
          'REDIS_URL is not configured in production. Falling back to in-memory cache; sessions and cache will reset on restart.',
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
