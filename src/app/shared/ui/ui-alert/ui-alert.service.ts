import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  UiAlertDialogComponent,
  UiAlertDialogData,
} from './ui-alert-dialog.component';

@Injectable({ providedIn: 'root' })
export class UiAlertService {
  private readonly dialog = inject(MatDialog);

  /** Popup modale: errore (palette Material error + superficie app). */
  error(message: string, title?: string): Observable<void> {
    return this.open({ type: 'error', message, title });
  }

  /** Popup modale: attenzione (tono ambra da `_colors.scss`). */
  warning(message: string, title?: string): Observable<void> {
    return this.open({ type: 'warning', message, title });
  }

  private open(data: UiAlertDialogData): Observable<void> {
    return this.dialog
      .open(UiAlertDialogComponent, {
        data,
        width: 'min(420px, calc(100vw - 48px))',
        panelClass: 'ui-alert-dialog-panel',
        autoFocus: 'first-tabbable',
        restoreFocus: true,
      })
      .afterClosed();
  }
}
