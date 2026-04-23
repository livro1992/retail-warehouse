import { Injectable, signal } from '@angular/core';

import type { PhysicalSubOrderStatus } from '../../data/suborder.types';

const STORAGE_KEY = 'rw-inserted-suborders-log-v1';
const MAX_ENTRIES = 200;

/** Voce di riepilogo per sub-order registrati con successo da questa UI. */
export interface InsertedSubOrderLogEntry {
  subOrderId: string;
  createdAt: string;
  parentOrderId: string | null;
  physicalStatus: PhysicalSubOrderStatus;
  lines: Array<{ orderItemId: string; productLabel: string; quantity: number }>;
}

function readStored(): InsertedSubOrderLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as InsertedSubOrderLogEntry[];
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class InsertedSubOrdersLogService {
  private readonly entriesSignal = signal<InsertedSubOrderLogEntry[]>(readStored());

  readonly entries = this.entriesSignal.asReadonly();

  addEntry(entry: InsertedSubOrderLogEntry): void {
    this.entriesSignal.update((prev) => {
      const next = [entry, ...prev.filter((e) => e.subOrderId !== entry.subOrderId)].slice(
        0,
        MAX_ENTRIES,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  clear(): void {
    this.entriesSignal.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }
}
