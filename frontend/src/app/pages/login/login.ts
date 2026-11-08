import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { AlertService } from '../../core/services/alert';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  username = signal('');
  password = signal('');

  private authService = inject(AuthService);
  private router = inject(Router);

  login(): void {

    this.authService.login( this.username(), this.password()).subscribe({

      next: (response) => {
        this.authService.setToken(response.token);
        this.router.navigate(['/vault']);
      }
      
    });

  }

}