/**
 * Allineamento a entità TypeORM `Order` / `OrderItem`
 * (`order_id`, enum su colonne, decimali come number in UI).
 */

export enum OrderType {
  receipt = 'receipt',
  transfer = 'transfer',
  selling = 'selling'
}

export enum OrderStatus {
  open = 'open',
  reserved = 'reserved',
  ready = 'ready',
  shipped = 'shipped',
  completed = 'completed',
  toRestock = 'to_restock',
  returned = 'returned',
  checkQuality = 'check_quality'
}

export enum OrderPaymentStatus {
  pending = 'pending',
  paid = 'paid',
  failed = 'failed',
  refunded = 'refunded',
}

/** Backend: `OrderFullfilmentMode` — valori stringa coerenti con DB. */
export enum OrderFulfillmentMode {
  instant = 'instant',
  pickup = 'pickup',
  delivery = 'delivery',
}

export interface OrderItem {
  orderItemId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  createdAt: string;
  updatedAt: string;
  orderType: OrderType;
  orderStatus: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  totalAmount: number;
  marketId: string;
  fulfillmentMode: OrderFulfillmentMode;
  orderItems: OrderItem[];
  paymentId?: string | null;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.open]: 'Aperto',
  [OrderStatus.reserved]: 'Riservato',
  [OrderStatus.ready]: 'Pronto',
  [OrderStatus.shipped]: 'Spedito',
  [OrderStatus.completed]: 'Completato',
  [OrderStatus.toRestock]: 'Da rifornire',
  [OrderStatus.returned]: 'Restituito',
  [OrderStatus.checkQuality]: 'Controllo qualità',
};

export const ORDER_PAYMENT_LABELS: Record<OrderPaymentStatus, string> = {
  [OrderPaymentStatus.pending]: 'In attesa',
  [OrderPaymentStatus.paid]: 'Pagato',
  [OrderPaymentStatus.failed]: 'Fallito',
  [OrderPaymentStatus.refunded]: 'Rimborsato',
};

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  [OrderType.receipt]: 'Ricevuta',
  [OrderType.transfer]: 'Trasferimento',
  [OrderType.selling]: 'Vendita',
};

export const ORDER_FULFILLMENT_LABELS: Record<OrderFulfillmentMode, string> = {
  [OrderFulfillmentMode.instant]: 'Immediato',
  [OrderFulfillmentMode.pickup]: 'Ritiro',
  [OrderFulfillmentMode.delivery]: 'Consegna',
};
