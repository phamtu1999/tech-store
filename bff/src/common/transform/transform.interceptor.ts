import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { toCamelCase } from '../utils/case-converter';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Skip transformation for binary data (Excel, etc.)
        if (Buffer.isBuffer(data)) {
          return data;
        }
        // Transform the response data to camelCase for the frontend
        return toCamelCase(data);
      }),
    );
  }
}
