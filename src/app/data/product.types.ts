/**
 * Modello prodotto allineato al DTO backend `CreateProductDto`
 * (`productId`, `name`, `description`, `basePrice`, `category?`).
 */
export interface Product {
  productId: string;
  name: string;
  description: string;
  basePrice: number;
  category?: string;
}
