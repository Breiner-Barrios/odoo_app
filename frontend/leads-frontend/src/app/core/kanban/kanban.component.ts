import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { LeadService } from '../services/lead.service';
import { Lead, Stage } from '../models/lead.model';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent {
  private readonly leadSvc = inject(LeadService);

  readonly errorMsg = signal<string | null>(null);

  readonly leads = this.leadSvc.leads;
  readonly stages = this.leadSvc.stages;
  readonly loading = this.leadSvc.loading;

  readonly leadsByStage = computed(() => {
    const groups = new Map<number, Lead[]>();
    for (const s of this.stages()) groups.set(s.id, []);
    for (const l of this.leads()) {
      if (!groups.has(l.stage_id)) groups.set(l.stage_id, []);
      groups.get(l.stage_id)!.push(l);
    }
    return groups;
  });

  constructor() {
    this.leadSvc.fetchLeads().subscribe({
      error: () => this.errorMsg.set('No se pudieron cargar los leads.'),
    });

    effect(() => { void this.leads(); this.errorMsg.set(null); });
  }

  connectedDropLists = computed(() => this.stages().map(s => this.dropListId(s)));

  dropListId(stage: Stage) {
    return `stage-${stage.id}`;
  }

  onDrop(event: CdkDragDrop<Lead[]>, toStage: Stage) {
    if (event.previousContainer === event.container) return;

    const lead = event.item.data as Lead;

    this.leadSvc.moveLeadOptimistic(lead.id, toStage.id).subscribe({
      error: () => this.errorMsg.set('No se pudo mover el lead. Se revirtió el cambio.')
    });
  }
}
