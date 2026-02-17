import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = 'http://localhost:8000/api/token/';

    // Signal para saber si el usuario está logueado
    isAuthenticated = signal<boolean>(!!localStorage.getItem('access_token'));

    login(username: string, password: string) {
        return this.http.post<any>(this.apiUrl, { username, password }).pipe(
            tap(response => {
                localStorage.setItem('access_token', response.access);
                localStorage.setItem('refresh_token', response.refresh);
                this.isAuthenticated.set(true);
                this.router.navigate(['/kanban']); // Al loguearse, vamos al tablero
            })
        );
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.isAuthenticated.set(false);
        this.router.navigate(['/login']);
    }
}