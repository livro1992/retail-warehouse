import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { catchError, finalize } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

import {
  PHYSICAL_SUB_ORDER_STATUS_LABELS,
  PhysicalSubOrderStatus,
  type SubOrder,
} from '../../../../data/suborder.types';
import type { Product } from '../../../../data/product.types';
import { ProductService } from '../../../services/product.service';
import { SubOrderService } from '../../../services/suborder.service';
import { UiAlertService } from '../../../../shared/ui';

export interface SubOrderViewRow {
  sub: SubOrder;
  lineSummary: string;
}

@Component({
  selector: 'app-main-page-warehouse-suborders',
  standalone: true,
  imports: [
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './main-page-warehouse-suborders.html',
  styleUrl: './main-page-warehouse-suborders.scss',
})
export class MainPageWarehouseSuborders implements OnInit {
  private readonly subOrderService = inject(SubOrderService);
  private readonly productService = inject(ProductService);
  private readonly uiAlert = inject(UiAlertService);

  readonly subOrders = signal<SubOrder[]>([]);
  private readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  /** filtro su id, stato, parent, testo nelle righe. */
  readonly filterText = signal('');
  /** id sub-order in corso di PATCH. */
  readonly patchPendingId = signal<string | null>(null);

  readonly nameByProductId = computed(
    () => new Map(this.products().map((p) => [p.productId, p.name] as const)),
  );

  private lineSummary(sub: SubOrder): string {
    const names = this.nameByProductId();
    return sub.items
      .map((it) => {
        const label = names.get(it.orderItemId) ?? it.orderItemId;
        return `${label} ×${it.quantity}`;
      })
      .join(', ');
  }

  /** Righe con riepilogo prodotto risolto da catalogo. */
  readonly rows = computed((): SubOrderViewRow[] => {
    return this.subOrders().map((sub) => ({
      sub,
      lineSummary: this.lineSummary(sub) || '—',
    }));
  });

  readonly filteredRows = computed(() => {
    const q = this.filterText().trim().toLowerCase();
    if (!q) return this.rows();
    return this.rows().filter((r) => {
      const s = r.sub;
      const stLabel = (PHYSICAL_SUB_ORDER_STATUS_LABELS[s.physicalStatus] ?? '').toLowerCase();
      return (
        s.subOrderId.toLowerCase().includes(q) ||
        (s.parentOrderId?.toLowerCase().includes(q) ?? false) ||
        s.physicalStatus.toLowerCase().includes(q) ||
        stLabel.includes(q) ||
        r.lineSummary.toLowerCase().includes(q)
      );
    });
  });

  readonly displayedColumns = [
    'createdAt',
    'subOrderId',
    'parentOrderId',
    'physicalStatus',
    'isPaid',
    'lines',
    'actions',
  ] as const;

  physicalStatusLabel(status: PhysicalSubOrderStatus): string {
    return PHYSICAL_SUB_ORDER_STATUS_LABELS[status];
  }

  ngOnInit(): void {
    this.loading.set(true);
    forkJoin({
      subOrders: this.subOrderService.listOrderSuborders(),
      products: this.productService
        .list()
        .pipe(catchError(() => of([] as Product[]))),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ subOrders, products }) => {
          this.subOrders.set(subOrders);
          this.products.set(products);
        },
        error: () => {
          this.uiAlert
            .error('Impossibile caricare l’elenco sub-order.', 'Errore')
            .subscribe();
        },
      });
  }

  canMarkShipped(physicalStatus: PhysicalSubOrderStatus): boolean {
    return physicalStatus !== PhysicalSubOrderStatus.SHIPPED;
  }

  setFilter(v: string): void {
    this.filterText.set(v);
  }

  markShipped(sub: SubOrder): void {
    this.patchPendingId.set(sub.subOrderId);
    this.subOrderService
      .updatePhysicalStatus(sub.subOrderId, PhysicalSubOrderStatus.SHIPPED)
      .pipe(finalize(() => this.patchPendingId.set(null)))
      .subscribe({
        next: (updated) => {
          this.subOrders.update((list) =>
            list.map((x) => (x.subOrderId === updated.subOrderId ? updated : x)),
          );
          this.uiAlert
            .success(
              `Sub-order ${updated.subOrderId} segnato come spedito.`,
              'Stato aggiornato',
            )
            .subscribe();
        },
        error: () => {
          this.uiAlert
            .error(
              'Aggiornamento non riuscito. Verifica PATCH su API sub-order o permessi.',
              'Errore',
            )
            .subscribe();
        },
      });
  }
}
