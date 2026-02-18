import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lead, Stage } from '../models/lead.model';
import { catchError, finalize, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private readonly baseUrl = 'http://127.0.0.1:8000/api/leads';

  private readonly _leads = signal<Lead[]>([]);
  private readonly _loading = signal(false);

  readonly leads = this._leads.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly stages = computed<Stage[]>(() => {
    const map = new Map<number, Stage>();
    for (const l of this._leads()) {
      if (!map.has(l.stage_id)) {
        map.set(l.stage_id, { id: l.stage_id, name: l.stage_name ?? `Stage ${l.stage_id}` });
      }
    }
    return Array.from(map.values()).sort((a, b) => (a.sequence ?? a.id) - (b.sequence ?? b.id));
  });

  constructor(private http: HttpClient) {}

  fetchLeads() {
    this._loading.set(true);
    return this.http.get<Lead[]>(`${this.baseUrl}/`).pipe(
      tap((data) => this._leads.set(data ?? [])),
      finalize(() => this._loading.set(false))
    );
  }

  moveLeadOptimistic(leadId: number, toStageId: number) {
    const prev = this._leads();
    const idx = prev.findIndex(l => l.id === leadId);
    if (idx === -1) return throwError(() => new Error('Lead no encontrado en state'));

    const fromStageId = prev[idx].stage_id;
    if (fromStageId === toStageId) return throwError(() => new Error('Mismo stage, no se mueve'));

    const updated = prev.map(l =>
      l.id === leadId ? { ...l, stage_id: toStageId, stage_name: undefined } : l
    );
    this._leads.set(updated);

    return this.http.patch(`${this.baseUrl}/${leadId}/`, { stage_id: toStageId }).pipe(
      catchError((err) => {
        this._leads.set(prev);
        return throwError(() => err);
      })
    );
  }
}
