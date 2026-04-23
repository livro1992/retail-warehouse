import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { TokenStorageService } from './token-storage.service';

export const authGuard: CanActivateFn = () => {
  const tokens = inject(TokenStorageService);
  const router = inject(Router);

  if (!tokens.hasToken() || tokens.isExpired()) {
    tokens.clear();
    void router.navigate(['/login']);
    return false;
  }
  return true;
};
