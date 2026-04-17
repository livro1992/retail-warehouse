import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs/operators';

import type { CreateProductDto, Product, UpdateProductDto } from '../../../../../data/product.types';
import { ProductService } from '../../../../services/product.service';
import { UiAlertService } from '../../../../../shared/ui';

export interface ProductFormDialogData {
  product: Product | null;
}

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './product-form-dialog.html',
  styleUrl: './product-form-dialog.scss',
})
export class ProductFormDialogComponent implements OnInit {
  readonly isEdit: boolean;
  private readonly productService = inject(ProductService);
  private readonly uiAlert = inject(UiAlertService);
  readonly saving = signal(false);

  form = new FormGroup({
    productId: new FormControl('', { nonNullable: true }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    basePrice: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
    category: new FormControl('', { nonNullable: true }),
  });

  constructor(
    private readonly ref: MatDialogRef<ProductFormDialogComponent, Product | undefined>,
    @Inject(MAT_DIALOG_DATA) public data: ProductFormDialogData,
  ) {
    this.isEdit = !!data.product;
  }

  ngOnInit(): void {
    const p = this.data.product;

    if (p) {
      this.form.patchValue({
        productId: p.productId,
        name: p.name,
        description: p.description,
        basePrice: p.basePrice,
        category: p.category ?? '',
      });
      this.form.controls.productId.disable();
    } else {
      this.form.controls.productId.setValue('(generato al salvataggio)');
      this.form.controls.productId.disable();
    }
  }

  cancel(): void {
    this.ref.close(undefined);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const basePrice = Number(raw.basePrice);
    const categoryTrim = raw.category?.trim();

    if (this.isEdit) {
      const p = this.data.product!;
      const dto: UpdateProductDto = {
        ...p,
        name: raw.name,
        description: raw.description,
        basePrice,
        ...(categoryTrim ? { category: categoryTrim } : { category: undefined }),
      }
      this.saving.set(true);

      this.productService
        .update(p.productId, dto)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: (updated) => this.ref.close(updated),
          error: () => {
            this.uiAlert
              .error('Creazione prodotto non riuscita. Controlla i dati o riprova.', 'Errore')
              .subscribe();
          },
        });
      
      return;
    }

    const dto: CreateProductDto = {
      productId: crypto.randomUUID(),
      name: raw.name,
      description: raw.description,
      basePrice,
      ...(categoryTrim ? { category: categoryTrim } : {}),
    };

    this.saving.set(true);
    this.productService
      .create(dto)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (created) => this.ref.close(created),
        error: () => {
          this.uiAlert
            .error('Creazione prodotto non riuscita. Controlla i dati o riprova.', 'Errore')
            .subscribe();
        },
      });
  }
}
