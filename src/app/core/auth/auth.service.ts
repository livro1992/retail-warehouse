import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);

  logout(): void {
    this.tokenStorage.clear();
    void this.router.navigate(['/login']);
  }
}
