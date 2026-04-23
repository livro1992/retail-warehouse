import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { Net } from '../../shared/constants/net';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';

/** Non allegare Bearer alla richiesta di login (evita token vecchi). */
const isAuthLoginRequest = (url: string): boolean => {
  const loginPath = `${Net.apiAddress}${Net.login}`;
  return url === loginPath || url.endsWith(Net.login);
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (isAuthLoginRequest(req.url)) {
    return next(req);
  }
  const tokens = inject(TokenStorageService);
  const token = tokens.getToken();
  const outgoing = token != null && token !== ''
      ? req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        })
      : req;

  return next(outgoing).pipe(
    catchError((err: unknown) => {
      if (
        err instanceof HttpErrorResponse &&
        err.status === 401 &&
        !isAuthLoginRequest(req.url)
      ) {
        auth.logout();
      }
      return throwError(() => err);
    }),
  );
};
