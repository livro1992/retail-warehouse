import { NgIf } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-ui-password-field',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './ui-password-field.html',
  styles: [
    `
      .ui-field {
        width: 100%;
      }
    `
  ]
})
export class UiPasswordFieldComponent {
  label = input<string>('Password');
  placeholder = input<string>('');
  autocomplete = input<string>('current-password');
  appearance = input<'outline' | 'fill'>('outline');

  control = input<FormControl<string>>(
    new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  );

  hidden = signal(true);
  inputType = computed(() => (this.hidden() ? 'password' : 'text'));

  toggle() {
    this.hidden.update((v) => !v);
  }
}

