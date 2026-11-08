
import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {

  private router = inject(Router);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  isAuthenticated = this.authService.isAuthenticated;
  username = signal('');

  constructor() {

    effect((onCleanup) => {

      if (!this.authService.isAuthenticated()) {
        this.username.set('');
        return;
      }

      const subscription = this.userService.getProfile().subscribe({

        next: (user) => {
          this.username.set(user.username);
        }

      });

      onCleanup(() => subscription.unsubscribe());

    });

  }

  logout(): void {
    this.authService.logout();
    this.username.set('');
    this.router.navigate(['/login']);
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

}
