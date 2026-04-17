import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs/operators';

import {
  PhysicalSubOrderStatus,
  PHYSICAL_SUB_ORDER_STATUS_LABELS,
  type CreateSubOrderDto,
  type CreateSubOrderItemDto,
} from '../../../../data/suborder.types';
import type { Product } from '../../../../data/product.types';
import { ProductService } from '../../../services/product.service';
import { SubOrderService } from '../../../services/suborder.service';
import { UiAlertService } from '../../../../shared/ui';

type ItemRow = FormGroup<{
  productId: FormControl<string>;
  quantity: FormControl<number | null>;
}>;

@Component({
  selector: 'app-main-page-insert-order',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './main-page-insert-order.html',
  styleUrl: './main-page-insert-order.scss',
})
export class MainPageInsertOrder implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly subOrderService = inject(SubOrderService);
  private readonly uiAlert = inject(UiAlertService);

  readonly products = signal<Product[]>([]);
  readonly saving = signal(false);
  readonly lastSuccessMessage = signal<string | null>(null);

  readonly physicalStatuses = Object.values(PhysicalSubOrderStatus);
  readonly physicalStatusLabels = PHYSICAL_SUB_ORDER_STATUS_LABELS;

  readonly form = this.fb.group({
    parentOrderId: this.fb.control('', { nonNullable: true }),
    physicalStatus: this.fb.control<PhysicalSubOrderStatus | ''>('', { nonNullable: true }),
    items: this.fb.array<ItemRow>([this.newItemRow()]),
  });

  ngOnInit(): void {
    this.productService.list().subscribe({
      next: (list) => this.products.set(list),
      error: () => {
        this.uiAlert
          .error('Impossibile caricare i prodotti per le righe sub-order.', 'Errore')
          .subscribe();
      },
    });
  }

  get items(): FormArray<ItemRow> {
    return this.form.controls.items;
  }

  private newItemRow(): ItemRow {
    return this.fb.group({
      productId: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      quantity: this.fb.control<number | null>(null, {
        validators: [Validators.required, Validators.min(1)],
      }),
    });
  }

  addItemRow(): void {
    this.items.push(this.newItemRow());
  }

  removeItemRow(index: number): void {
    if (this.items.length <= 1) {
      return;
    }
    this.items.removeAt(index);
  }

  submit(): void {
    this.lastSuccessMessage.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const rowValues = raw.items ?? [];
    const items: CreateSubOrderItemDto[] = [];
    for (const row of rowValues) {
      const qty = row.quantity != null ? Number(row.quantity) : NaN;
      const pid = row.productId?.trim() ?? '';
      if (!pid || !Number.isFinite(qty) || qty < 1) {
        continue;
      }
      items.push({ orderItemId: pid, quantity: Math.trunc(qty) });
    }

    if (items.length === 0) {
      this.uiAlert
        .warning('Indica almeno una riga con prodotto e quantità intera ≥ 1.', 'Dati mancanti')
        .subscribe();
      return;
    }

    const dto: CreateSubOrderDto = {
      items,
      ...(raw.parentOrderId?.trim() ? { parentOrderId: raw.parentOrderId.trim() } : {}),
      ...(raw.physicalStatus ? { physicalStatus: raw.physicalStatus } : {}),
    };

    this.saving.set(true);
    this.subOrderService
      .create(dto)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (created) => {
          this.lastSuccessMessage.set(`Sub-order ${created.subOrderId} creato.`);
          this.form.patchValue({ parentOrderId: '', physicalStatus: '' });
          this.items.clear();
          this.items.push(this.newItemRow());
        },
        error: () => {
          this.uiAlert
            .error('Creazione sub-order non riuscita. Verifica i dati o l’endpoint API.', 'Errore')
            .subscribe();
        },
      });
  }
}
