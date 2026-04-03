import type { User } from './user.types';

/** Risposta tipica login JWT (allinea chiavi al backend, es. Nest). */
export interface LoginResponse {
  access_token: string;
  user: User;
}
