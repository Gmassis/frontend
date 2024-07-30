import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, retry } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  return next(request).pipe(
    retry(2),
    catchError(() => {
      return next(request);
    })
  );
};
