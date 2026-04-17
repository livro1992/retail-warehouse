import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpManager } from '../../core/http/http_manager';
import type { CreateProductDto, Product, UpdateProductDto } from '../../data/product.types';
import { Net } from '../../shared/constants/net';

@Injectable({ providedIn: 'root' })
export class ProductService extends HttpManager {
  constructor(http: HttpClient) {
    super(http);
  }

  /** GET `/api/inventory/products/` — il backend risponde sempre con `Product[]`. */
  list(): Observable<Product[]> {
    const url = `${Net.apiAddress}${Net.inventoryProducts}`;
    return this.get<Product[]>(url);
  }

  /** POST `/api/inventory/products/` — risposta: prodotto creato (con `productId`). */
  create(dto: CreateProductDto): Observable<Product> {
    const url = `${Net.apiAddress}${Net.inventoryProducts}`;
    return this.post<Product>(url, dto);
  }

  update(id: string, dto: UpdateProductDto): Observable<Product> {
    const url = `${Net.apiAddress}${Net.inventoryProducts}${id}`;
    return this.put<Product>(url, dto);
  }
}
