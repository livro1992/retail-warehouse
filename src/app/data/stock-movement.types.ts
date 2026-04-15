/**
 * Allineato all'entity TypeORM `StockMovement` e all'enum `MovementType`.
 * Da API, `createdAt` può arrivare come stringa ISO: normalizzare dove serve.
 */
export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  RESERVE = 'RESERVE',
  RELEASE = 'RELEASE',
  ADJUSTMENT = 'ADJUSTMENT',
}

export interface StockMovement {
  id: string;
  productId: string;
  marketId: string;
  type: MovementType;
  quantity: number;
  orderId?: string | null;
  reason?: string | null;
  createdAt: Date;
}
