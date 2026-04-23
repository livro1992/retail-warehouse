import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import {
  PHYSICAL_SUB_ORDER_STATUS_LABELS,
  type PhysicalSubOrderStatus,
  type SubOrder,
} from '../../../../data/suborder.types';
import { UiAlertService } from '../../../../shared/ui';
import {
  InsertedSubOrdersLogService,
  type InsertedSubOrderLogEntry,
} from '../../../services/inserted-suborders-log.service';
import { SubOrderService } from '../../../services/suborder.service';

function subOrderToLogEntry(sub: SubOrder): InsertedSubOrderLogEntry {
  return {
    subOrderId: sub.subOrderId,
    createdAt: sub.createdAt,
    parentOrderId: sub.parentOrderId,
    physicalStatus: sub.physicalStatus,
    lines: sub.items.map((it) => ({
      orderItemId: it.orderItemId,
      productLabel: it.orderItemId,
      quantity: it.quantity,
    })),
  };
}

@Component({
  selector: 'app-main-page-insert-order-summary',
  standalone: true,
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    RouterLink,
  ],
  templateUrl: './main-page-insert-order-summary.html',
  styleUrl: './main-page-insert-order-summary.scss',
})
export class MainPageInsertOrderSummary implements OnInit {
  private readonly log = inject(InsertedSubOrdersLogService);
  private readonly subOrderService = inject(SubOrderService);
  private readonly uiAlert = inject(UiAlertService);

  private readonly serverEntries = signal<InsertedSubOrderLogEntry[]>([]);
  readonly loading = signal(true);

  /** Sub-order dal server (`GET /api/order/suborder`) più voci solo-locali non ancora sul server. */
  readonly entries = computed(() => {
    const fromServer = this.serverEntries();
    const fromLog = this.log.entries();
    const serverIds = new Set(fromServer.map((e) => e.subOrderId));
    const onlyLocal = fromLog.filter((e) => !serverIds.has(e.subOrderId));
    return [...fromServer, ...onlyLocal];
  });

  readonly displayedColumns = [
    'createdAt',
    'subOrderId',
    'parentOrderId',
    'physicalStatus',
    'linesSummary',
  ] as const;

  /** Le righe `mat-table` sono tipizzate come `any` nel template: etichetta via metodo. */
  physicalStatusLabel(status: PhysicalSubOrderStatus): string {
    return PHYSICAL_SUB_ORDER_STATUS_LABELS[status];
  }

  linesTooltip(entry: InsertedSubOrderLogEntry): string {
    return entry.lines.map((l) => `${l.productLabel} × ${l.quantity}`).join('\n');
  }

  linesSummaryText(entry: InsertedSubOrderLogEntry): string {
    if (entry.lines.length === 0) {
      return '—';
    }
    return entry.lines.map((l) => `${l.productLabel} ×${l.quantity}`).join(', ');
  }

  ngOnInit(): void {
    this.subOrderService
      .listOrderSuborders()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (list) => this.serverEntries.set(list.map(subOrderToLogEntry)),
        error: () => {
          this.uiAlert
            .error('Impossibile caricare l’elenco sub-order dal server.', 'Errore')
            .subscribe();
        },
      });
  }

  clearLog(): void {
    this.log.clear();
  }
}
