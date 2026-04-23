/**
 * Allineamento a entity Nest `SubOrder` / `SubOrderItem` e DTO `CreateSubOrderDto` / `CreateSubOrderItemDto`.
 * Se `PhysicalSubOrderStatus` sul server usa stringhe diverse, aggiorna solo questo enum (e le etichette).
 */

/**
 * Valori stringa = `@IsEnum(PhysicalSubOrderStatus)` Nest / colonna `physical_status`.
 * Copiali dal file enum del backend se questi placeholder non coincidono.
 */
export enum PhysicalSubOrderStatus {
  PENDING = 'PENDING',
  IN_PREPARATION = 'IN_PREPARATION',
  READY = 'READY',
  SHIPPED = 'SHIPPED',
}

export const PHYSICAL_SUB_ORDER_STATUS_LABELS: Record<PhysicalSubOrderStatus, string> = {
  [PhysicalSubOrderStatus.PENDING]: 'In attesa',
  [PhysicalSubOrderStatus.IN_PREPARATION]: 'In preparazione',
  [PhysicalSubOrderStatus.READY]: 'Pronto',
  [PhysicalSubOrderStatus.SHIPPED]: 'Spedito',
};

/**
 * Body POST per ogni riga (Nest `CreateSubOrderItemDto`).
 * In UI si sceglie il prodotto: il suo `productId` viene inviato come `orderItemId` se coincide con l’atteso dal backend.
 */
export interface CreateSubOrderItemDto {
  orderItemId: string;
  quantity: number;
}

/** Body POST `/api/inventory/suborders/`. */
export interface CreateSubOrderDto {
  parentOrderId?: string;
  physicalStatus?: PhysicalSubOrderStatus;
  items?: CreateSubOrderItemDto[];
}

/** Riga persistita `sub_order_item`. */
export interface SubOrderItem {
  subOrderItemId: string;
  subOrderId: string;
  orderItemId: string;
  quantity: number;
}

/** Risposta API / entity `SubOrder` (date serializzate come stringa ISO). */
export interface SubOrder {
  subOrderId: string;
  createdAt: string;
  updatedAt: string;
  parentOrderId: string | null;
  physicalStatus: PhysicalSubOrderStatus;
  isPaid: boolean;
  items: SubOrderItem[];
}
