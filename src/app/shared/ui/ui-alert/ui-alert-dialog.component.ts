import { Component, computed, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type UiAlertKind = 'error' | 'warning';

export interface UiAlertDialogData {
  type: UiAlertKind;
  message: string;
  title?: string;
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

  readonly iconName = computed(() =>
    this.data.type === 'error' ? 'error' : 'warning_amber',
  );

  readonly titleText = computed(() => {
    if (this.data.title?.trim()) {
      return this.data.title.trim();
    }
    return this.data.type === 'error' ? 'Errore' : 'Attenzione';
  });

  close(): void {
    this.dialogRef.close();
  }
}
