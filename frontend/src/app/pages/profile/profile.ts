import { Component, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../core/services/alert';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent {

  username = signal('');
  password = signal('');
  confirmPassword = signal('');
  editMode = signal(false);
  showDeleteModal = signal(false);

  constructor( private authService: AuthService, private userService: UserService, private router: Router,   private alertService: AlertService ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile(): void {

    this.userService.getProfile().subscribe({
      next: (user) => {
        this.username.set(
          user.username
        );
      }
    });
  }

  enableEdit(): void {
    this.editMode.set(true);
    this.password.set('');
    this.confirmPassword.set('');
  }

  cancelEdit(): void {
    this.password.set('');
    this.confirmPassword.set('');
    this.editMode.set(false);
  }

  save(): void {

    if ( this.password() && this.password() !== this.confirmPassword() ) {
      
      this.alertService.showAlert({
        message:'Le password non coincidono',
        classAlert:'error'
      });

      return;
    }

    this.userService.updateProfile( this.username(), this.password() || undefined ).subscribe({
      next: () => {
        
        this.userService.username.set(this.username());
        this.alertService.showAlert({
          message:'Profilo aggiornato correttamente',
          classAlert:'success'
        });

        this.editMode.set(false);
      }
    });
  }

  confirmDelete(): void {
    this.userService.deleteProfile().subscribe({
      next: () => {
        this.authService.logout();
        
        this.alertService.showAlert({
          message:'Profilo eliminato correttamente',
          classAlert:'success'
        });

        this.router.navigate(['/register']);
      }

    });
  }

}