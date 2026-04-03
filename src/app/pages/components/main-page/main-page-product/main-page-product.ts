import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import {
  ProductFormDialogComponent,
  type ProductFormDialogData,
} from './product-form-dialog/product-form-dialog.component';
import type { Product } from '../../../../data/product.types';

@Component({
  selector: 'app-main-page-product',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    DecimalPipe,
  ],
  templateUrl: './main-page-product.html',
  styleUrl: './main-page-product.scss',
})
export class MainPageProduct {
  private readonly dialog = inject(MatDialog);

  /** Bozza: dati locali; sostituire con chiamate HTTP (payload come CreateProductDto). */
  readonly products = signal<Product[]>([
    {
      productId: 'demo-1',
      name: 'Caffè in grani 1 kg',
      description: 'Miscela arabica, tostatura media.',
      basePrice: 12.5,
      category: 'Bevande',
    },
    {
      productId: 'demo-2',
      name: 'Zucchero 500 g',
      description: 'Zucchero semolato.',
      basePrice: 1.2,
    },
  ]);

  /** Testo libero su id, nome, descrizione, categoria, prezzo. */
  readonly filterText = signal('');

  /** Filtro aggiuntivo sulla categoria (contiene). */
  readonly filterCategory = signal('');

  readonly selectedIds = signal<Set<string>>(new Set());

  readonly filteredProducts = computed(() => {
    const list = this.products();
    const q = this.filterText().trim().toLowerCase();
    const cat = this.filterCategory().trim().toLowerCase();

    return list.filter((p) => {
      if (cat && !(p.category?.toLowerCase().includes(cat) ?? false)) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        p.productId.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.category?.toLowerCase().includes(q) ?? false) ||
        String(p.basePrice).includes(q)
      );
    });
  });

  readonly displayedColumns = [
    'select',
    'productId',
    'name',
    'basePrice',
    'category',
    'actions',
  ] as const;

  readonly masterChecked = computed(() => {
    const rows = this.filteredProducts();
    if (rows.length === 0) {
      return false;
    }
    const sel = this.selectedIds();
    return rows.every((p) => sel.has(p.productId));
  });

  readonly masterIndeterminate = computed(() => {
    const rows = this.filteredProducts();
    if (rows.length === 0) {
      return false;
    }
    const sel = this.selectedIds();
    const n = rows.filter((p) => sel.has(p.productId)).length;
    return n > 0 && n < rows.length;
  });

  isRowSelected(p: Product): boolean {
    return this.selectedIds().has(p.productId);
  }

  toggleRow(p: Product, checked: boolean): void {
    this.selectedIds.update((s) => {
      const next = new Set(s);
      if (checked) {
        next.add(p.productId);
      } else {
        next.delete(p.productId);
      }
      return next;
    });
  }

  toggleAllFiltered(checked: boolean): void {
    const ids = this.filteredProducts().map((p) => p.productId);
    this.selectedIds.update((s) => {
      const next = new Set(s);
      if (checked) {
        ids.forEach((id) => next.add(id));
      } else {
        ids.forEach((id) => next.delete(id));
      }
      return next;
    });
  }

  openCreate(): void {
    this.dialog
      .open<ProductFormDialogComponent, ProductFormDialogData, Product | undefined>(
        ProductFormDialogComponent,
        {
          data: { product: null },
          width: 'min(480px, calc(100vw - 32px))',
          panelClass: 'product-form-dialog-panel',
          autoFocus: 'first-tabbable',
        },
      )
      .afterClosed()
      .subscribe((p) => {
        if (p) {
          this.products.update((list) => [...list, p]);
        }
      });
  }

  openEdit(product: Product): void {
    this.dialog
      .open<ProductFormDialogComponent, ProductFormDialogData, Product | undefined>(
        ProductFormDialogComponent,
        {
          data: { product },
          width: 'min(480px, calc(100vw - 32px))',
          panelClass: 'product-form-dialog-panel',
          autoFocus: 'first-tabbable',
        },
      )
      .afterClosed()
      .subscribe((p) => {
        if (!p) return;
        this.products.update((list) =>
          list.map((x) => (x.productId === p.productId ? p : x)),
        );
      });
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Eliminare "${product.name}" (${product.productId})?`)) {
      return;
    }
    this.products.update((list) => list.filter((x) => x.productId !== product.productId));
    this.selectedIds.update((s) => {
      const next = new Set(s);
      next.delete(product.productId);
      return next;
    });
  }
}
