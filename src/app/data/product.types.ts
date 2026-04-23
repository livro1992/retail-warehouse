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

/** Corpo POST creazione: `productId` opzionale (es. se lo assegna il server). */
export type CreateProductDto = Omit<Product, 'productId'> & { productId?: string };
export type UpdateProductDto = Omit<Product, 'productId'>;
