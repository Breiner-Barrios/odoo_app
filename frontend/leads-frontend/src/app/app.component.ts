import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { LeadService } from './core/services/lead.service';
import { Lead } from './core/models/lead.model';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, DragDropModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    private leadService = inject(LeadService);

    // Accedemos al signal del servicio
    leads = this.leadService.leads;

    ngOnInit() {
        this.leadService.getLeads().subscribe();
    }

    // Filtra los leads según el ID de etapa de Odoo
    getLeadsByStage(stageId: number): Lead[] {
        return this.leads().filter((lead: Lead) => lead.stage_id[0] === stageId);
    }

    drop(event: CdkDragDrop<Lead[]>, newStageId: number) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            const lead = event.previousContainer.data[event.previousIndex];

            // Llamada al Backend (Django)
            this.leadService.updateLeadStage(lead.id, newStageId).subscribe({
                next: () => {
                    // Refrescamos los datos para confirmar el cambio
                    this.leadService.getLeads().subscribe();
                    console.log(`Lead ${lead.id} movido a etapa ${newStageId}`);
                },
                error: (err) => {
                    console.error('Error al mover el lead:', err);
                    // Aquí podrías añadir una lógica para revertir el movimiento visual
                }
            });
        }
    }
}