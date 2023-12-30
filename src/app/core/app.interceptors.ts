import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken,
  HttpContext,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { TokenService } from '../core/services/token/token.service';

const CHECK_INTERCEPT = new HttpContextToken<boolean>(() => true);

export function skipIntercept() {
  return new HttpContext().set(CHECK_INTERCEPT, false);
}

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(
    private _tokenSvc: TokenService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = this.addToken(request);
    return next
      .handle(request)
      .pipe(finalize(() => {}));
  }

  private addToken(request: HttpRequest<unknown>) {

    const token = localStorage.getItem('access_token');
    if (token) {
      const cloneRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });

      return cloneRequest;
    }

    return request;
  }
}