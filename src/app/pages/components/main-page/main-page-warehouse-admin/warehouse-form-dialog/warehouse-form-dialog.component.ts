import { Component, Inject, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs/operators';

import type { CreateWarehouseDto, UpdateWarehouseDto, Warehouse } from '../../../../../data/warehouse.types';
import { UiAlertService } from '../../../../../shared/ui';
import { WarehouseService } from '../../../../services/warehouse.service';

export interface WarehouseFormDialogData {
  warehouse: Warehouse | null;
}

@Component({
  selector: 'app-warehouse-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './warehouse-form-dialog.html',
  styleUrl: './warehouse-form-dialog.scss',
})
export class WarehouseFormDialogComponent {
  readonly isEdit: boolean;
  readonly saving = signal(false);

  private readonly warehouseService = inject(WarehouseService);
  private readonly uiAlert = inject(UiAlertService);

  readonly form = new FormGroup({
    marketId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
  });

  constructor(
    private readonly ref: MatDialogRef<WarehouseFormDialogComponent, Warehouse | undefined>,
    @Inject(MAT_DIALOG_DATA) public data: WarehouseFormDialogData,
  ) {
    this.isEdit = !!data.warehouse;
    if (data.warehouse) {
      this.form.patchValue({
        marketId: data.warehouse.marketId,
        name: data.warehouse.name,
      });
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
    if (this.isEdit) {
      const warehouse = this.data.warehouse!;
      const dto: UpdateWarehouseDto = {
        marketId: raw.marketId.trim(),
        name: raw.name.trim(),
      };
      this.saving.set(true);
      this.warehouseService
        .update(String(warehouse.warehouseId), dto)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: (updated) => this.ref.close(updated),
          error: () => {
            this.uiAlert.error('Aggiornamento magazzino non riuscito.', 'Errore').subscribe();
          },
        });
      return;
    }

    const dto: CreateWarehouseDto = {
      marketId: raw.marketId.trim(),
      name: raw.name.trim(),
    };
    this.saving.set(true);
    this.warehouseService
      .create(dto)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (created) => this.ref.close(created),
        error: () => {
          this.uiAlert.error('Creazione magazzino non riuscita.', 'Errore').subscribe();
        },
      });
  }
}
