import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import type { Product } from '../../../../../data/product.types';

export interface ProductDetailDialogData {
  product: Product;
}

/** Chiusura con `'edit'` apre il form di modifica dal componente padre. */
export type ProductDetailDialogResult = void | 'edit';

@Component({
  selector: 'app-product-detail-dialog',
  standalone: true,
  imports: [MatButtonModule, DecimalPipe],
  templateUrl: './product-detail-dialog.html',
  styleUrl: './product-detail-dialog.scss',
})
export class ProductDetailDialogComponent {
  readonly data = inject<ProductDetailDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<ProductDetailDialogComponent, ProductDetailDialogResult>);

  close(): void {
    this.ref.close();
  }

  edit(): void {
    this.ref.close('edit');
  }
}
