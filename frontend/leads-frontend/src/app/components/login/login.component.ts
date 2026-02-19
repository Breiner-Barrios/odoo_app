import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);

  onSubmit(event: Event) {
    event.preventDefault();
    const target = event.target as any;
    const username = target[0].value;
    const password = target[1].value;

    this.authService.login(username, password).subscribe({
      next: () => console.log('Login exitoso'),
      error: (err) => alert('Credenciales incorrectas')
    });
  }
}