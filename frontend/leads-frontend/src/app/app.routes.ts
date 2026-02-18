import { Routes } from '@angular/router';
import { KanbanComponent } from './core/kanban/kanban.component';

export const routes: Routes = [
  { path: 'kanban', component: KanbanComponent },
  { path: '', redirectTo: 'kanban', pathMatch: 'full' },
];
