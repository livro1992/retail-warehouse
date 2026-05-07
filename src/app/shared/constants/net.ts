/** Base API: in dev con `ng serve` il proxy (proxy.conf.json) inoltra `/api` → `http://localhost:3000`. */
export enum Net {
    apiAddress = '/api',
    /** GET elenco prodotti inventario (proxy dev → `http://localhost:3000/api/...`). */
    inventoryProducts = '/inventory/products/',
    /**
     * POST ordine di vendita (cassa). Nest atteso: `@Controller('orders')` + `@Post('selling')` → `POST /api/orders/selling`
     * oppure, se usate un solo `POST /orders` con `orderType` nel body, aggiornare `OrderService` e questa costante in `net.ts`.
     */
    ordersSelling = '/orders/selling',
    /** POST creazione sub-order magazzino. */
    subOrders = '/suborders',
    /** GET elenco sub-order in attesa. Nest atteso: `GET /api/suborders/pending` */
    subOrdersPending = '/suborders/pending',
    authUsers = '/auth/all',
    authCreateUser = '/auth/create',
    authUpdateUser = '/auth/update',
    authUsersBase = '/auth',
    inventoryWarehouses = '/inventory/warehouses',
    inventoryStoreWarehouseAccess = '/inventory/store-warehouse-access',
    login = '/auth/sign_in',
    register = '/register',
    forgotPassword = '/forgot-password',
    resetPassword = '/reset-password',
    //verifyEmail = '/verify-email',
    //verifyEmailToken = '/verify-email-token',
    //verifyEmailToken = '/verify-email-token',
}

/**
 * Path singolo sub-order. Nest atteso: `@Controller('suborders')` + `@Patch(':id')` → `PATCH /api/suborders/:id` con body `{ physicalStatus }`.
 */
export function subOrderByIdPath(subOrderId: string): string {
  return `${Net.subOrders}/${encodeURIComponent(subOrderId)}`;
}

export function userByIdPath(userId: string): string {
  return `${Net.authUsersBase}/${encodeURIComponent(userId)}`;
}

export function userUpdateByIdPath(userId: string): string {
  return `${Net.authUpdateUser}/${encodeURIComponent(userId)}`;
}

export function warehouseByIdPath(warehouseId: string): string {
  return `${Net.inventoryWarehouses}/${encodeURIComponent(warehouseId)}`;
}

export function storeWarehouseAccessPath(
  marketId: string,
  storeContextKey: string
): string {
  return `${Net.inventoryStoreWarehouseAccess}/${encodeURIComponent(marketId)}/${encodeURIComponent(storeContextKey)}`;
}