import { ThemeService } from './theme.service';

/** Da usare con `APP_INITIALIZER` e `deps: [ThemeService]`. */
export function initTheme(theme: ThemeService): () => void {
  return () => theme.syncFromStorage();
}
