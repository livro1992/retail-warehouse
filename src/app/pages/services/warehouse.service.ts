import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpManager } from '../../core/http/http_manager';
import type {
  CreateStoreWarehouseAccessDto,
  CreateWarehouseDto,
  DeleteStoreWarehouseAccessDto,
  StoreWarehouseAccess,
  UpdateWarehouseDto,
  Warehouse,
} from '../../data/warehouse.types';
import {
  Net,
  storeWarehouseAccessPath,
  warehouseByIdPath,
} from '../../shared/constants/net';

@Injectable({ providedIn: 'root' })
export class WarehouseService extends HttpManager {
  constructor(http: HttpClient) {
    super(http);
  }

  /** GET `/api/inventory/warehouses` */
  list(): Observable<Warehouse[]> {
    const url = `${Net.apiAddress}${Net.inventoryWarehouses}`;
    return this.get<Warehouse[]>(url);
  }

  /** GET `/api/inventory/warehouses/:warehouseId` */
  getById(warehouseId: string | number): Observable<Warehouse> {
    const url = `${Net.apiAddress}${warehouseByIdPath(String(warehouseId))}`;
    return this.get<Warehouse>(url);
  }

  /** POST `/api/inventory/warehouses` */
  create(dto: CreateWarehouseDto): Observable<Warehouse> {
    const url = `${Net.apiAddress}${Net.inventoryWarehouses}`;
    return this.post<Warehouse>(url, dto);
  }

  /** PATCH `/api/inventory/warehouses/:warehouseId` */
  update(warehouseId: string | number, dto: UpdateWarehouseDto): Observable<Warehouse> {
    const url = `${Net.apiAddress}${warehouseByIdPath(String(warehouseId))}`;
    return this.patch<Warehouse>(url, dto);
  }

  /** DELETE `/api/inventory/warehouses/:warehouseId` */
  remove(warehouseId: string | number): Observable<void> {
    const url = `${Net.apiAddress}${warehouseByIdPath(String(warehouseId))}`;
    return super.delete<void>(url);
  }

  /** GET `/api/inventory/store-warehouse-access/:marketId/:storeContextKey` */
  listStoreWarehouseAccess(
    marketId: string,
    storeContextKey: string,
  ): Observable<StoreWarehouseAccess[]> {
    const url = `${Net.apiAddress}${storeWarehouseAccessPath(marketId, storeContextKey)}`;
    return this.get<StoreWarehouseAccess[]>(url);
  }

  /** POST `/api/inventory/store-warehouse-access` */
  createStoreWarehouseAccess(
    dto: CreateStoreWarehouseAccessDto,
  ): Observable<StoreWarehouseAccess> {
    const url = `${Net.apiAddress}${Net.inventoryStoreWarehouseAccess}`;
    return this.post<StoreWarehouseAccess>(url, dto);
  }

  /** DELETE `/api/inventory/store-warehouse-access/:marketId/:storeContextKey/:warehouseId` */
  deleteStoreWarehouseAccess(dto: DeleteStoreWarehouseAccessDto): Observable<void> {
    const url = `${Net.apiAddress}${storeWarehouseAccessPath(dto.marketId, dto.storeContextKey)}/${encodeURIComponent(String(dto.warehouseId))}`;
    return super.delete<void>(url);
  }
}
