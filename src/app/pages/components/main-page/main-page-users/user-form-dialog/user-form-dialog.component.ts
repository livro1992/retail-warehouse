import { Component, Inject, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs/operators';

import { type CreateUserDto, type UpdateUserDto, type User, UserRole } from '../../../../../data/user.types';
import { UiAlertService } from '../../../../../shared/ui';
import { UserService } from '../../../../services/user.service';

export interface UserFormDialogData {
  user: User | null;
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './user-form-dialog.html',
  styleUrl: './user-form-dialog.scss',
})
export class UserFormDialogComponent {
  readonly isEdit: boolean;
  readonly saving = signal(false);
  readonly roleOptions = Object.values(UserRole);

  private readonly userService = inject(UserService);
  private readonly uiAlert = inject(UiAlertService);

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    role: new FormControl<UserRole>(UserRole.user, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    assignedWarehouseId: new FormControl<number | null>(null),
    password: new FormControl('', { nonNullable: true }),
  });

  constructor(
    private readonly ref: MatDialogRef<UserFormDialogComponent, User | undefined>,
    @Inject(MAT_DIALOG_DATA) public data: UserFormDialogData,
  ) {
    this.isEdit = !!data.user;
    if (data.user) {
      this.form.patchValue({
        email: data.user.email,
        role: data.user.role,
        assignedWarehouseId: data.user.assignedWarehouseId ?? null,
      });
    } else {
      this.form.controls.password.setValidators([
        Validators.required,
        Validators.minLength(8),
      ]);
    }
    this.form.controls.password.updateValueAndValidity({ emitEvent: false });
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
    const assignedWarehouseId = raw.assignedWarehouseId;

    if (this.isEdit) {
      const user = this.data.user!;
      const dto: UpdateUserDto = {
        email: raw.email.trim(),
        role: raw.role,
        assignedWarehouseId,
      };
      this.saving.set(true);
      this.userService
        .update(String(user.userId), dto)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: (updated) => this.ref.close(updated),
          error: () => {
            this.uiAlert.error('Aggiornamento utente non riuscito.', 'Errore').subscribe();
          },
        });
      return;
    }

    const dto: CreateUserDto = {
      email: raw.email.trim(),
      password: raw.password,
      role: raw.role,
      ...(assignedWarehouseId != null ? { assignedWarehouseId } : {}),
    };
    this.saving.set(true);
    this.userService
      .create(dto)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (created) => this.ref.close(created),
        error: () => {
          this.uiAlert.error('Creazione utente non riuscita.', 'Errore').subscribe();
        },
      });
  }
}
