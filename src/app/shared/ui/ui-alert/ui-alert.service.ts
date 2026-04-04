import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import {
  UiAlertDialogComponent,
  type UiAlertDialogData,
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

  /**
   * Sostituisce `window.confirm`: stesso stile degli altri popup (`ui-alert-dialog-panel`).
   * Emette `true` se l'utente conferma, altrimenti `false`.
   */
  confirm(
    message: string,
    title?: string,
    options?: { confirmLabel?: string; cancelLabel?: string },
  ): Observable<boolean> {
    return this.dialog
      .open(UiAlertDialogComponent, {
        data: {
          type: 'warning',
          message,
          title,
          confirm: true,
          confirmLabel: options?.confirmLabel,
          cancelLabel: options?.cancelLabel,
        } satisfies UiAlertDialogData,
        width: 'min(420px, calc(100vw - 48px))',
        panelClass: 'ui-alert-dialog-panel',
        autoFocus: 'first-tabbable',
        restoreFocus: true,
      })
      .afterClosed()
      .pipe(map((v) => v === true));
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
