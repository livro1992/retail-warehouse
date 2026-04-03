import { NgIf } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-ui-card',
  imports: [MatCardModule, NgIf],
  templateUrl: './ui-card.html',
  styleUrls: ['./ui-card.style.scss']
})
export class UiCardComponent {
  title = input<string | null>(null);
  subtitle = input<string | null>(null);
  appearance = input<'outlined' | 'raised'>('outlined');
  showActions = input(false);
}

