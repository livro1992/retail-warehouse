import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import type {
  DeleteStoreWarehouseAccessDto,
  StoreWarehouseAccess,
  Warehouse,
} from '../../../../data/warehouse.types';
import { UiAlertService } from '../../../../shared/ui';
import { WarehouseService } from '../../../services/warehouse.service';
import {
  WarehouseFormDialogComponent,
  type WarehouseFormDialogData,
} from './warehouse-form-dialog/warehouse-form-dialog.component';

@Component({
  selector: 'app-main-page-warehouse-admin',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './main-page-warehouse-admin.html',
  styleUrl: './main-page-warehouse-admin.scss',
})
export class MainPageWarehouseAdmin implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly uiAlert = inject(UiAlertService);
  private readonly warehouseService = inject(WarehouseService);

  readonly warehouses = signal<Warehouse[]>([]);
  readonly filterText = signal('');
  readonly displayedWarehouseColumns = ['warehouseId', 'marketId', 'name', 'actions'] as const;

  readonly mappingMarketId = signal('');
  readonly mappingStoreContextKey = signal('');
  readonly mappingWarehouseId = signal<number | null>(null);
  readonly mappings = signal<StoreWarehouseAccess[]>([]);
  readonly displayedMappingColumns = ['marketId', 'storeContextKey', 'warehouseId', 'actions'] as const;

  readonly filteredWarehouses = computed(() => {
    const q = this.filterText().trim().toLowerCase();
    const list = this.warehouses();
    if (!q) {
      return list;
    }
    return list.filter((w) => {
      return (
        String(w.warehouseId).toLowerCase().includes(q) ||
        w.marketId.toLowerCase().includes(q) ||
        w.name.toLowerCase().includes(q)
      );
    });
  });

  ngOnInit(): void {
    this.reloadWarehouses();
  }

  reloadWarehouses(): void {
    this.warehouseService.list().subscribe({
      next: (rows) => this.warehouses.set(rows),
      error: () => {
        this.uiAlert.error('Impossibile caricare la lista magazzini.', 'Errore di rete').subscribe();
      },
    });
  }

  openCreateWarehouse(): void {
    this.dialog
      .open<WarehouseFormDialogComponent, WarehouseFormDialogData, Warehouse | undefined>(
        WarehouseFormDialogComponent,
        {
          data: { warehouse: null },
          width: 'min(520px, calc(100vw - 32px))',
          panelClass: 'warehouse-form-dialog-panel',
          autoFocus: 'first-tabbable',
        },
      )
      .afterClosed()
      .subscribe((warehouse) => {
        if (!warehouse) {
          return;
        }
        this.warehouses.update((list) => [...list, warehouse]);
      });
  }

  openEditWarehouse(warehouse: Warehouse): void {
    this.dialog
      .open<WarehouseFormDialogComponent, WarehouseFormDialogData, Warehouse | undefined>(
        WarehouseFormDialogComponent,
        {
          data: { warehouse },
          width: 'min(520px, calc(100vw - 32px))',
          panelClass: 'warehouse-form-dialog-panel',
          autoFocus: 'first-tabbable',
        },
      )
      .afterClosed()
      .subscribe((updated) => {
        if (!updated) {
          return;
        }
        this.warehouses.update((list) =>
          list.map((x) => (x.warehouseId === updated.warehouseId ? updated : x)),
        );
      });
  }

  deleteWarehouse(warehouse: Warehouse): void {
    this.uiAlert
      .confirm(`Eliminare il magazzino "${warehouse.name}"?`, 'Elimina magazzino', {
        confirmLabel: 'Elimina',
        cancelLabel: 'Annulla',
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.warehouseService.remove(String(warehouse.warehouseId)).subscribe({
          next: () => {
            this.warehouses.update((list) => list.filter((x) => x.warehouseId !== warehouse.warehouseId));
            this.mappings.update((list) =>
              list.filter((x) => x.warehouseId !== warehouse.warehouseId),
            );
          },
          error: () => {
            this.uiAlert.error('Eliminazione magazzino non riuscita.', 'Errore').subscribe();
          },
        });
      });
  }

  loadMappings(): void {
    const marketId = this.mappingMarketId().trim();
    const storeContextKey = this.mappingStoreContextKey().trim();
    if (!marketId || !storeContextKey) {
      this.uiAlert
        .error('Compila marketId e storeContextKey per leggere le associazioni.', 'Dati mancanti')
        .subscribe();
      return;
    }
    this.warehouseService.listStoreWarehouseAccess(marketId, storeContextKey).subscribe({
      next: (rows) => this.mappings.set(rows),
      error: () => {
        this.uiAlert.error('Caricamento associazioni non riuscito.', 'Errore').subscribe();
      },
    });
  }

  addMapping(): void {
    const marketId = this.mappingMarketId().trim();
    const storeContextKey = this.mappingStoreContextKey().trim();
    const warehouseId = this.mappingWarehouseId();
    if (!marketId || !storeContextKey || warehouseId == null) {
      this.uiAlert
        .error('Compila marketId, storeContextKey e seleziona il magazzino.', 'Dati mancanti')
        .subscribe();
      return;
    }
    this.warehouseService
      .createStoreWarehouseAccess({
        marketId,
        storeContextKey,
        warehouseId,
      })
      .subscribe({
        next: () => this.loadMappings(),
        error: () => {
          this.uiAlert.error('Creazione associazione non riuscita.', 'Errore').subscribe();
        },
      });
  }

  removeMapping(row: StoreWarehouseAccess): void {
    const dto: DeleteStoreWarehouseAccessDto = {
      marketId: row.marketId,
      storeContextKey: row.storeContextKey,
      warehouseId: row.warehouseId,
    };
    this.warehouseService.deleteStoreWarehouseAccess(dto).subscribe({
      next: () => {
        this.mappings.update((list) =>
          list.filter(
            (x) =>
              !(
                x.marketId === row.marketId &&
                x.storeContextKey === row.storeContextKey &&
                x.warehouseId === row.warehouseId
              ),
          ),
        );
      },
      error: () => {
        this.uiAlert.error('Rimozione associazione non riuscita.', 'Errore').subscribe();
      },
    });
  }
}
