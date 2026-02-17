import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet], // Solo necesita RouterOutlet para manejar las páginas
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    // Ya no necesita ngOnInit ni lógica de Leads aquí.
    // Todo eso ahora vive en KanbanComponent.
    title = 'leads-frontend';
}