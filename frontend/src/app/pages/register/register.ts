import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { AlertService } from '../../core/services/alert';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  username = signal('');
  password = signal('');
  confirmPassword = signal('');

  errorMessage = signal('');

  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService)

  register(): void {

    if (this.password() !== this.confirmPassword()) {

      this.alertService.showAlert({
        message:'Le password non coincidono',
        classAlert:'error'
      });

      return;
    }

    this.authService.register( this.username(), this.password()).subscribe({
      next: () => {

        this.alertService.showAlert({
          message:'Profilo creato correttamente',
          classAlert:'success'
        });

        this.router.navigate(['/login']);
      }
    });

  }

}