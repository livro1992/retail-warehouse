/** Base API: in dev con `ng serve` il proxy (proxy.conf.json) inoltra `/api` → `http://localhost:3000`. */
export enum Net {
    apiAddress = '/api',
    /** GET elenco prodotti inventario (proxy dev → `http://localhost:3000/api/...`). */
    inventoryProducts = '/inventory/products/',
    /** POST creazione sub-order magazzino. */
    subOrders = '/suborders',
    /** GET elenco sub-order in attesa (se esposto dal backend). */
    subOrdersPending = '/suborders/pending',
    login = '/auth/sign_in',
    register = '/register',
    forgotPassword = '/forgot-password',
    resetPassword = '/reset-password',
    //verifyEmail = '/verify-email',
    //verifyEmailToken = '/verify-email-token',
    //verifyEmailToken = '/verify-email-token',
}