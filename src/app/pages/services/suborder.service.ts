import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpManager } from '../../core/http/http_manager';
import type {
  CreateSubOrderDto,
  PhysicalSubOrderStatus,
  SubOrder,
  UpdateSubOrderPhysicalStatusDto,
} from '../../data/suborder.types';
import { Net, subOrderByIdPath } from '../../shared/constants/net';

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

  /** GET `/api/suborders/pending` — elenco sub-order dal server. */
  listOrderSuborders(): Observable<SubOrder[]> {
    const url = `${Net.apiAddress}${Net.subOrdersPending}`;
    return this.get<SubOrder[]>(url);
  }

  /**
   * Aggiorna lo stato fisico (es. consegnato/spedito). Nest: `PATCH /api/suborders/:id`.
   */
  updatePhysicalStatus(
    subOrderId: string,
    physicalStatus: PhysicalSubOrderStatus,
  ): Observable<SubOrder> {
    const body: UpdateSubOrderPhysicalStatusDto = { physicalStatus };
    const url = `${Net.apiAddress}${subOrderByIdPath(subOrderId)}`;
    return this.patch<SubOrder>(url, body);
  }
}
