import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { Net } from '../../shared/constants/net';
import { TokenStorageService } from './token-storage.service';

/** Non allegare Bearer alla richiesta di login (evita token vecchi). */
const isAuthLoginRequest = (url: string): boolean => {
  const loginPath = `${Net.apiAddress}${Net.login}`;
  return url === loginPath || url.endsWith(Net.login);
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (isAuthLoginRequest(req.url)) {
    return next(req);
  }
  const tokens = inject(TokenStorageService);
  const token = tokens.getToken();
  if (!token) {
    return next(req);
  }
  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
