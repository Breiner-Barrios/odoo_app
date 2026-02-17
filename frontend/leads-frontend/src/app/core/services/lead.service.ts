import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lead } from '../models/lead.model';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LeadService {
    private apiUrl = 'http://localhost:8000/api/leads/';

    // Signal para almacenar los leads de forma reactiva
    leads = signal<Lead[]>([]);

    // Nuevo Signal para las etapas
    stages = signal<any[]>([]);

    // Método para obtener las etapas desde Django
    getStages() {
        return this.http.get<any[]>('http://localhost:8000/api/stages/').pipe(
            tap(stages => this.stages.set(stages))
        );
    }

    constructor(private http: HttpClient) { }

    // Obtener leads y actualizar el signal
    getLeads(): Observable<Lead[]> {
        return this.http.get<Lead[]>(this.apiUrl).pipe(
            tap(data => this.leads.set(data))
        );
    }

    // Actualizar etapa en el servidor
    updateLeadStage(leadId: number, stageId: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}${leadId}/`, { stage_id: stageId });
    }
}