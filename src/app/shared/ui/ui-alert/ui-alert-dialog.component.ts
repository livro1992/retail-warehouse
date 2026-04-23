import { Component, computed, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type UiAlertKind = 'error' | 'warning' | 'success';

export interface UiAlertDialogData {
  type: UiAlertKind;
  message: string;
  title?: string;
  /** Se true: pulsanti Annulla / Conferma e chiusura con `true` | `false`. */
  confirm?: boolean;
  /** Etichetta pulsante conferma (default: Conferma). */
  confirmLabel?: string;
  /** Etichetta pulsante annulla (default: Annulla). */
  cancelLabel?: string;
}

@Component({
  selector: 'app-ui-alert-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './ui-alert-dialog.html',
  styleUrl: './ui-alert-dialog.scss',
})
export class UiAlertDialogComponent {
  readonly data = inject<UiAlertDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UiAlertDialogComponent>);

  readonly iconName = computed(() => {
    if (this.data.confirm) {
      return 'help_outline';
    }
    if (this.data.type === 'error') {
      return 'error';
    }
    if (this.data.type === 'success') {
      return 'check_circle';
    }
    return 'warning_amber';
  });

  readonly titleText = computed(() => {
    if (this.data.title?.trim()) {
      return this.data.title.trim();
    }
    if (this.data.confirm) {
      return 'Conferma';
    }
    if (this.data.type === 'error') {
      return 'Errore';
    }
    if (this.data.type === 'success') {
      return 'Operazione completata';
    }
    return 'Attenzione';
  });

  readonly confirmLabelText = computed(
    () => this.data.confirmLabel?.trim() || 'Conferma',
  );

  readonly cancelLabelText = computed(
    () => this.data.cancelLabel?.trim() || 'Annulla',
  );

  close(result?: boolean): void {
    this.dialogRef.close(this.data.confirm ? result === true : undefined);
  }
}
