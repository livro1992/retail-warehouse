import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import type { Order } from '../../../../data/order.types';
import {
  OrderFulfillmentMode,
  OrderPaymentStatus,
  OrderStatus,
  OrderType,
  ORDER_FULFILLMENT_LABELS,
  ORDER_PAYMENT_LABELS,
  ORDER_STATUS_LABELS,
  ORDER_TYPE_LABELS,
} from '../../../../data/order.types';
import {
  OrderPrepDialogComponent,
  type OrderPrepDialogData,
} from './order-prep-dialog/order-prep-dialog.component';

function iso(d: Date): string {
  return d.toISOString();
}

@Component({
  selector: 'app-main-page-order-prep',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './main-page-order-prep.html',
  styleUrl: './main-page-order-prep.scss',
})
export class MainPageOrderPrep {
  private readonly dialog = inject(MatDialog);

  readonly statusLabels = ORDER_STATUS_LABELS;

  readonly orderStatuses = Object.values(OrderStatus);

  /** `mat-table` espone `row` come `any`: etichette via `Order` tipizzato. */
  orderTypeLabel(o: Order): string {
    return ORDER_TYPE_LABELS[o.orderType];
  }

  orderStatusLabel(o: Order): string {
    return ORDER_STATUS_LABELS[o.orderStatus];
  }

  paymentLabel(o: Order): string {
    return ORDER_PAYMENT_LABELS[o.paymentStatus];
  }

  fulfillmentLabel(o: Order): string {
    return ORDER_FULFILLMENT_LABELS[o.fulfillmentMode];
  }

  readonly filterText = signal('');
  readonly filterStatus = signal<OrderStatus | ''>('');

  /** Bozza locale; sostituire con API ordini. */
  readonly orders = signal<Order[]>([
    {
      orderId: 'ord-demo-1',
      createdAt: iso(new Date(Date.now() - 3600_000)),
      updatedAt: iso(new Date(Date.now() - 1800_000)),
      orderType: OrderType.receipt,
      orderStatus: OrderStatus.open,
      paymentStatus: OrderPaymentStatus.paid,
      totalAmount: 42.5,
      marketId: 'mkt-milano-1',
      fulfillmentMode: OrderFulfillmentMode.pickup,
      paymentId: 'pay-1',
      orderItems: [
        {
          orderItemId: 'oi-1',
          productId: 'demo-1',
          productName: 'Caffè in grani 1 kg',
          quantity: 2,
          price: 12.5,
        },
        {
          orderItemId: 'oi-2',
          productId: 'demo-2',
          productName: 'Zucchero 500 g',
          quantity: 4,
          price: 1.2,
        },
      ],
    },
    {
      orderId: 'ord-demo-2',
      createdAt: iso(new Date(Date.now() - 7200_000)),
      updatedAt: iso(new Date(Date.now() - 4000_000)),
      orderType: OrderType.receipt,
      orderStatus: OrderStatus.reserved,
      paymentStatus: OrderPaymentStatus.pending,
      totalAmount: 89.9,
      marketId: 'mkt-milano-1',
      fulfillmentMode: OrderFulfillmentMode.instant,
      orderItems: [
        {
          orderItemId: 'oi-3',
          productId: 'demo-1',
          productName: 'Caffè in grani 1 kg',
          quantity: 1,
          price: 12.5,
        },
      ],
    },
    {
      orderId: 'ord-demo-3',
      createdAt: iso(new Date(Date.now() - 86400_000)),
      updatedAt: iso(new Date(Date.now() - 80000_000)),
      orderType: OrderType.receipt,
      orderStatus: OrderStatus.ready,
      paymentStatus: OrderPaymentStatus.paid,
      totalAmount: 15.0,
      marketId: 'mkt-roma-2',
      fulfillmentMode: OrderFulfillmentMode.pickup,
      orderItems: [
        {
          orderItemId: 'oi-4',
          productId: 'demo-2',
          productName: 'Zucchero 500 g',
          quantity: 10,
          price: 1.2,
        },
      ],
    },
  ]);

  readonly filteredOrders = computed(() => {
    const list = this.orders();
    const q = this.filterText().trim().toLowerCase();
    const st = this.filterStatus();

    return list.filter((o) => {
      if (st && o.orderStatus !== st) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        o.orderId.toLowerCase().includes(q) ||
        o.marketId.toLowerCase().includes(q) ||
        o.orderItems.some(
          (i) =>
            i.productId.toLowerCase().includes(q) ||
            i.productName.toLowerCase().includes(q),
        )
      );
    });
  });

  readonly displayedColumns = [
    'orderId',
    'createdAt',
    'marketId',
    'orderType',
    'orderStatus',
    'paymentStatus',
    'fulfillmentMode',
    'totalAmount',
    'actions',
  ] as const;

  openPrep(order: Order): void {
    this.dialog
      .open<OrderPrepDialogComponent, OrderPrepDialogData, Order | undefined>(
        OrderPrepDialogComponent,
        {
          data: { order },
          width: 'min(560px, calc(100vw - 32px))',
          panelClass: 'order-prep-dialog-panel',
          autoFocus: 'first-tabbable',
        },
      )
      .afterClosed()
      .subscribe((updated) => {
        if (!updated) {
          return;
        }
        this.orders.update((rows) =>
          rows.map((r) => (r.orderId === updated.orderId ? updated : r)),
        );
      });
  }
}
