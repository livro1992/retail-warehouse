import { NgIf } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-ui-text-field',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, NgIf],
  templateUrl: './ui-text-field.html',
  styles: [
    `
      .ui-field {
        width: 100%;
      }
    `
  ]
})
export class UiTextFieldComponent {
  label = input<string>('Campo');
  placeholder = input<string>('');
  autocomplete = input<string>('off');
  type = input<'text' | 'email' | 'tel'>('text');
  appearance = input<'outline' | 'fill'>('outline');

  // Keep it simple for now: the consumer provides its FormControl.
  // (We can evolve this to CVA later if you want the UI kit to be fully drop-in.)
  control = input<FormControl<string>>(
    new FormControl('', { nonNullable: true, validators: [Validators.required] })
  );
}

