/** Warehouse restituito dagli endpoint inventory. */
export interface Warehouse {
  warehouseId: number;
  marketId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/** Payload creazione warehouse (`POST /api/inventory/warehouses`). */
export interface CreateWarehouseDto {
  marketId: string;
  name: string;
}

/** Payload aggiornamento warehouse. */
export interface UpdateWarehouseDto {
  marketId?: string;
  name?: string;
}

/** Associazione store context -> warehouse. */
export interface StoreWarehouseAccess {
  marketId: string;
  storeContextKey: string;
  warehouseId: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Payload creazione associazione store context -> warehouse. */
export interface CreateStoreWarehouseAccessDto {
  marketId: string;
  storeContextKey: string;
  warehouseId: number;
}

/** Dati necessari per rimozione associazione. */
export interface DeleteStoreWarehouseAccessDto {
  marketId: string;
  storeContextKey: string;
  warehouseId: number;
}
