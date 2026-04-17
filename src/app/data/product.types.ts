/**
 * Modello prodotto restituito dal backend (include `productId`).
 */
export interface Product {
  productId: string;
  name: string;
  description: string;
  basePrice: number;
  category?: string;
}

/** Corpo POST creazione: niente `productId` (lo assegna il server). */
export type CreateProductDto = Product;///Omit<Product, 'productId'>;
export type UpdateProductDto = Omit<Product, 'productId'>;
