import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpManager } from '../../core/http/http_manager';
import type { CreateSubOrderDto, SubOrder } from '../../data/suborder.types';
import { Net } from '../../shared/constants/net';

@Injectable({ providedIn: 'root' })
export class SubOrderService extends HttpManager {
  constructor(http: HttpClient) {
    super(http);
  }

  /** POST `/api/inventory/suborders/` */
  create(dto: CreateSubOrderDto): Observable<SubOrder> {
    const url = `${Net.apiAddress}${Net.subOrders}`;
    return this.post<SubOrder>(url, dto);
  }
}
