/**
 * Modello utente lato client, allineato all'entity TypeORM `User`.
 * `password` non è esposta (select: false sul backend e mai usata nel front).
 */
export enum UserRole {
  admin = 'admin',
  user = 'user',
  operatore = 'operator',
}

export interface User {
  userId: number;
  email: string;
  role: UserRole;
}
