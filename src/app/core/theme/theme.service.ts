import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'rw-theme';

/**
 * Applica il tema aggiungendo/rimuovendo `theme-light` su `<html>`
 * (vedi `styles.scss`: Material + variabili `--app-*`).
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** `true` = tema chiaro (`html.theme-light`). */
  readonly isLight = signal(false);

  /** Legge preferenza salvata e aggiorna DOM + signal. Chiamare all'avvio app. */
  syncFromStorage(): void {
    let light = false;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      light = raw === 'light';
    } catch { }
    this.applyLight(light, false);
  }

  /** Imposta tema e opzionalmente persiste. */
  setLight(light: boolean, persist = true): void {
    this.applyLight(light, persist);
  }

  toggle(): void {
    this.setLight(!this.isLight());
  }

  private applyLight(light: boolean, persist: boolean): void {
    document.documentElement.classList.toggle('theme-light', light);
    this.isLight.set(light);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, light ? 'light' : 'dark');
      } catch { }
    }
  }
}
