import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'rw_jwt_access_token';

/**
 * Persistenza e lettura JWT (localStorage).
 * La firma non viene verificata lato client; `isExpired` usa solo il claim `exp`.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly token = signal<string | null>(this.readFromStorage());

  hasToken(): boolean {
    return this.token() != null && this.token() !== '';
  }

  getToken(): string | null {
    return this.token();
  }

  setToken(accessToken: string): void {
    const t = accessToken.trim();
    if (!t) {
      this.clear();
      return;
    }
    localStorage.setItem(STORAGE_KEY, t);
    this.token.set(t);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.token.set(null);
  }

  /** Payload JWT decodificato (nessuna verifica crittografica). */
  getPayload(): Record<string, unknown> | null {
    const t = this.getToken();

    if (!t) return null;
    
    try {
      const parts = t.split('.');

      if (parts.length !== 3) return null;

      let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      
      if (pad) {
        base64 += '='.repeat(4 - pad);
      }
      return JSON.parse(atob(base64)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  /**
   * true se manca `exp` o il token è scaduto (margine default 60s).
   * Utile per guard o refresh; la scadenza reale resta lato server.
   */
  isExpired(leewaySeconds = 60): boolean {
    const payload = this.getPayload();
    const exp = payload?.['exp'];
    
    if (typeof exp !== 'number') {
      return true;
    }
    const expMs = exp * 1000;
    return Date.now() >= expMs - leewaySeconds * 1000;
  }

  private readFromStorage(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }
}
