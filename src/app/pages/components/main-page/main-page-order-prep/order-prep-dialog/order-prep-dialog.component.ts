import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import type { Order } from '../../../../../data/order.types';
import {
  OrderPaymentStatus,
  OrderStatus,
  ORDER_FULFILLMENT_LABELS,
  ORDER_PAYMENT_LABELS,
  ORDER_STATUS_LABELS,
  ORDER_TYPE_LABELS,
} from '../../../../../data/order.types';

export interface OrderPrepDialogData {
  order: Order;
}

@Component({
  selector: 'app-order-prep-dialog',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './order-prep-dialog.html',
  styleUrl: './order-prep-dialog.scss',
})
export class OrderPrepDialogComponent {
  readonly data = inject<OrderPrepDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<OrderPrepDialogComponent, Order | undefined>);

  readonly OrderStatus = OrderStatus;
  readonly orderStatuses = Object.values(OrderStatus);
  readonly OrderPaymentStatus = OrderPaymentStatus;
  readonly statusLabels = ORDER_STATUS_LABELS;
  readonly paymentLabels = ORDER_PAYMENT_LABELS;
  readonly typeLabels = ORDER_TYPE_LABELS;
  readonly fulfillmentLabels = ORDER_FULFILLMENT_LABELS;

  draft: Order;

  readonly itemColumns = ['productName', 'quantity', 'price', 'lineTotal'] as const;

  constructor() {
    const o = this.data.order;
    this.draft = {
      ...o,
      orderItems: o.orderItems.map((i) => ({ ...i })),
    };
  }

  lineTotal(qty: number, price: number): number {
    return Math.round(qty * price * 100) / 100;
  }

  cancel(): void {
    this.ref.close(undefined);
  }

  save(): void {
    const now = new Date().toISOString();
    this.draft = { ...this.draft, updatedAt: now };
    this.ref.close(this.draft);
  }
}
