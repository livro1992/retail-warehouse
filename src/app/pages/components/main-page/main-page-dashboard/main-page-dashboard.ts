import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/** Serie mock per grafico lineare (es. vendite ultimi giorni). */
const LINE_SERIES = [42, 38, 52, 48, 61, 55, 67];

/** Dati mock per grafico a barre. */
const BAR_ROWS = [
  { label: 'Cassa 1', value: 72 },
  { label: 'Cassa 2', value: 54 },
  { label: 'Online', value: 88 },
  { label: 'B2B', value: 41 },
];

@Component({
  selector: 'app-main-page-dashboard',
  standalone: true,
  imports: [MatCardModule, MatIconModule, DecimalPipe],
  templateUrl: './main-page-dashboard.html',
  styleUrl: './main-page-dashboard.scss',
})
export class MainPageDashboard {
  readonly lineSeries = LINE_SERIES;
  readonly linePoints = polylinePoints(LINE_SERIES, 200, 96);
  readonly barRows = BAR_ROWS;
  readonly barMax = Math.max(...BAR_ROWS.map((b) => b.value), 1);

  readonly topSold = [
    { name: 'Caffè in grani 1 kg', sold: 428 },
    { name: 'Zucchero 500 g', sold: 312 },
    { name: 'Latte UHT 1 L', sold: 287 },
    { name: 'Acqua naturale 6x', sold: 201 },
  ];

  readonly lowStock = [
    { name: 'Biscotti assortiti', qty: 4, minLevel: 20 },
    { name: 'The in bustine', qty: 8, minLevel: 24 },
    { name: 'Cacao amaro', qty: 2, minLevel: 12 },
  ];
}

function polylinePoints(values: number[], width: number, height: number): string {
  if (values.length === 0) {
    return '';
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padX = 8;
  const padY = 8;
  const innerW = width - 2 * padX;
  const innerH = height - 2 * padY;
  return values
    .map((v, i) => {
      const x = padX + (values.length === 1 ? innerW / 2 : (i / (values.length - 1)) * innerW);
      const y = padY + innerH - ((v - min) / range) * innerH;
      return `${x},${y}`;
    })
    .join(' ');
}
