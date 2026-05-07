import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import type { User } from '../../../../data/user.types';
import { UiAlertService } from '../../../../shared/ui';
import { UserService } from '../../../services/user.service';
import {
  UserFormDialogComponent,
  type UserFormDialogData,
} from './user-form-dialog/user-form-dialog.component';

@Component({
  selector: 'app-main-page-users',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './main-page-users.html',
  styleUrl: './main-page-users.scss',
})
export class MainPageUsers implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly uiAlert = inject(UiAlertService);
  private readonly userService = inject(UserService);

  readonly users = signal<User[]>([]);
  readonly filterText = signal('');

  readonly displayedColumns = ['userId', 'email', 'role', 'assignedWarehouseId', 'actions'] as const;

  readonly filteredUsers = computed(() => {
    const q = this.filterText().trim().toLowerCase();
    const list = this.users();
    if (!q) {
      return list;
    }
    return list.filter((u) => {
      const assignedWarehouse = u.assignedWarehouseId != null ? String(u.assignedWarehouseId) : '';
      return (
        String(u.userId).toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        String(u.role).toLowerCase().includes(q) ||
        assignedWarehouse.includes(q)
      );
    });
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.userService.list().subscribe({
      next: (rows) => this.users.set(rows),
      error: () => {
        this.uiAlert.error('Impossibile caricare la lista utenti.', 'Errore di rete').subscribe();
      },
    });
  }

  openCreate(): void {
    this.dialog
      .open<UserFormDialogComponent, UserFormDialogData, User | undefined>(UserFormDialogComponent, {
        data: { user: null },
        width: 'min(520px, calc(100vw - 32px))',
        panelClass: 'user-form-dialog-panel',
        autoFocus: 'first-tabbable',
      })
      .afterClosed()
      .subscribe((user) => {
        if (!user) {
          return;
        }
        this.users.update((list) => [...list, user]);
      });
  }

  openEdit(user: User): void {
    this.dialog
      .open<UserFormDialogComponent, UserFormDialogData, User | undefined>(UserFormDialogComponent, {
        data: { user },
        width: 'min(520px, calc(100vw - 32px))',
        panelClass: 'user-form-dialog-panel',
        autoFocus: 'first-tabbable',
      })
      .afterClosed()
      .subscribe((updated) => {
        if (!updated) {
          return;
        }
        this.users.update((list) => list.map((x) => (x.userId === updated.userId ? updated : x)));
      });
  }

  deleteUser(user: User): void {
    this.uiAlert
      .confirm(`Eliminare l'utente "${user.email}"?`, 'Elimina utente', {
        confirmLabel: 'Elimina',
        cancelLabel: 'Annulla',
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.userService.remove(String(user.userId)).subscribe({
          next: () => {
            this.users.update((list) => list.filter((x) => x.userId !== user.userId));
          },
          error: () => {
            this.uiAlert.error('Eliminazione utente non riuscita.', 'Errore').subscribe();
          },
        });
      });
  }
}
