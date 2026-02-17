import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { KanbanComponent } from './components/kanban/kanban.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'kanban', component: KanbanComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
