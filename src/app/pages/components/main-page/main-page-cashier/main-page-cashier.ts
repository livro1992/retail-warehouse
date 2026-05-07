import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize } from 'rxjs/operators';

import {
  OrderFulfillmentMode,
  OrderPaymentStatus,
  OrderType,
  ORDER_FULFILLMENT_LABELS,
  type CreateSellingOrderItemDto,
} from '../../../../data/order.types';
import type { Product } from '../../../../data/product.types';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { UiAlertService } from '../../../../shared/ui';

type CartLine = { productId: string; quantity: number };

@Component({
  selector: 'app-main-page-cashier',
  standalone: true,
  imports: [
    DecimalPipe,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './main-page-cashier.html',
  styleUrl: './main-page-cashier.scss',
})
export class MainPageCashier implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly uiAlert = inject(UiAlertService);

  readonly products = signal<Product[]>([]);
  readonly filterText = signal('');
  /** Righe carrello: productId + quantità. */
  readonly cart = signal<CartLine[]>([]);
  readonly saving = signal(false);
  readonly fulfillment = signal(OrderFulfillmentMode.instant);
  readonly marketId = signal('');

  readonly fulfillmentModes = Object.values(OrderFulfillmentMode);
  readonly fulfillmentLabels = ORDER_FULFILLMENT_LABELS;

  readonly nameById = computed(() => {
    return new Map(this.products().map((p) => [p.productId, p.name] as const));
  });

  readonly productById = computed(() => {
    return new Map(this.products().map((p) => [p.productId, p] as const));
  });

  readonly filteredProducts = computed(() => {
    const q = this.filterText().trim().toLowerCase();
    const list = this.products();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.productId.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  });

  readonly total = computed(() => {
    const map = this.productById();
    return this.cart().reduce((sum, line) => {
      const p = map.get(line.productId);
      if (!p) return sum;
      return sum + p.basePrice * line.quantity;
    }, 0);
  });

  readonly cartColumns = ['name', 'unit', 'quantity', 'lineTotal', 'actions'] as const;
  readonly catalogColumns = ['name', 'price', 'actions'] as const;

  ngOnInit(): void {
    this.productService.list().subscribe({
      next: (rows) => this.products.set(rows),
      error: () => {
        this.uiAlert
          .error(
            'Impossibile caricare il catalogo. Verifica rete e server.',
            'Errore',
          )
          .subscribe();
      },
    });
  }

  setFilter(value: string): void {
    this.filterText.set(value);
  }

  setFulfillment(mode: OrderFulfillmentMode): void {
    this.fulfillment.set(mode);
  }

  setMarketId(value: string): void {
    this.marketId.set(value);
  }

  addToCart(productId: string): void {
    this.cart.update((rows) => {
      const i = rows.findIndex((l) => l.productId === productId);
      if (i < 0) {
        return [...rows, { productId, quantity: 1 }];
      }
      const next = [...rows];
      next[i] = { productId, quantity: next[i].quantity + 1 };
      return next;
    });
  }

  decLine(productId: string): void {
    this.cart.update((rows) => {
      const i = rows.findIndex((l) => l.productId === productId);
      if (i < 0) return rows;
      const q = rows[i].quantity - 1;
      if (q < 1) {
        return rows.filter((_, j) => j !== i);
      }
      const next = [...rows];
      next[i] = { productId, quantity: q };
      return next;
    });
  }

  lineTotal(line: CartLine): number {
    const p = this.productById().get(line.productId);
    if (!p) return 0;
    return p.basePrice * line.quantity;
  }

  lineLabel(line: CartLine): string {
    return this.nameById().get(line.productId) ?? line.productId;
  }

  registerSale(): void {
    const items: CreateSellingOrderItemDto[] = this.cart().map((l) => ({
      productId: l.productId,
      quantity: l.quantity,
    }));
    if (items.length === 0) {
      this.uiAlert
        .warning('Aggiungi almeno un prodotto al carrello.', 'Carrello vuoto')
        .subscribe();
      return;
    }

    const market = this.marketId().trim();
    this.saving.set(true);
    this.orderService
      .createSellingOrder({
        orderType: OrderType.selling,
        fulfillmentMode: this.fulfillment(),
        items,
        paymentStatus: OrderPaymentStatus.paid,
        ...(market ? { marketId: market } : {}),
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (order) => {
          this.cart.set([]);
          this.uiAlert
            .success(
              `Vendita registrata. ID ordine: ${order.orderId}`,
              'Vendita registrata',
            )
            .subscribe();
        },
        error: () => {
          this.uiAlert
            .error(
              'Registrazione ordine non riuscita. Verifica dati o endpoint API.',
              'Errore',
            )
            .subscribe();
        },
      });
  }
}
