import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpManager } from '../../core/http/http_manager';
import type { CreateSellingOrderDto, Order } from '../../data/order.types';
import { Net } from '../../shared/constants/net';

@Injectable({ providedIn: 'root' })
export class OrderService extends HttpManager {
  constructor(http: HttpClient) {
    super(http);
  }

  /** POST `/api/orders/selling` — crea ordine vendita; risposta: `Order` completo. */
  createSellingOrder(dto: CreateSellingOrderDto): Observable<Order> {
    const url = `${Net.apiAddress}${Net.ordersSelling}`;
    return this.post<Order>(url, dto);
  }
}
