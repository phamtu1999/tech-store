import * as http from 'http';
import * as https from 'https';

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
