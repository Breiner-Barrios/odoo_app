import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { LeadService } from '../../core/services/lead.service';
import { Lead } from '../../core/models/lead.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class KanbanComponent implements OnInit {
  private authService = inject(AuthService);
  private leadService = inject(LeadService);

  // Accedemos al signal del servicio
  leads = this.leadService.leads;
  stages = this.leadService.stages; //accedemos a las etapas
  isAdmin = this.authService.isAdmin();

  ngOnInit() {
    this.leadService.getStages().subscribe();
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

  isModalOpen = false;

  openModal() { this.isModalOpen = true; }
  closeModal() { this.isModalOpen = false; }

  onCreateLead(event: Event) {
    event.preventDefault();
    const target = event.target as any;

    const newLead = {
      name: target.name.value,
      contact_name: target.contact_name.value,
      email_from: target.email_from.value,
      stage_id: 1 // Por defecto a la primera etapa (Nuevos)
    };

    this.leadService.createLead(newLead).subscribe({
      next: () => {
        this.closeModal();
        console.log('Lead creado con éxito');
      },
      error: (err) => alert('Error al crear lead: ' + err.message)
    });
  }

  onDeleteLead(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este lead de Odoo?')) {
      this.leadService.deleteLead(id).subscribe({
        next: () => console.log('Lead eliminado'),
        error: (err) => alert('No tienes permisos para borrar o hubo un error.')
      });
    }
  }

  onLogout() {
    this.authService.logout(); // Esto borrará los tokens y te llevará al Login
  }
}

