/**
 * Modello utente lato client, allineato all'entity TypeORM `User`.
 * `password` non è esposta (select: false sul backend e mai usata nel front).
 */
export enum UserRole {
  admin = 'admin',
  user = 'user',
  operatore = 'operator',
}

/** Utente restituito dagli endpoint `auth/*`. */
export interface User {
  userId: number;
  email: string;
  role: UserRole;
  assignedWarehouseId?: number | null;
}

/** Payload creazione utente (`POST /api/auth/create`). */
export interface CreateUserDto {
  email: string;
  password: string;
  role?: UserRole;
  assignedWarehouseId?: number;
}

/** Payload aggiornamento utente senza password. */
export interface UpdateUserDto {
  email?: string;
  role?: UserRole;
  assignedWarehouseId?: number | null;
}
