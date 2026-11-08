import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HealthService } from './core/services/health';
import { NavbarComponent } from './layout/navbar/navbar';
import { FooterComponent } from './layout/footer/footer';
import { AlertService } from './core/services/alert';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  backendAvailable = signal(false);
  alert = computed(() => this.alertService.alert());
  
  constructor(
    private healthService: HealthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {

    this.healthService.getHealth().subscribe({

      next: (response) => {
        this.backendAvailable.set(true);
      },

      error: (error) => {
        this.backendAvailable.set(false);
      }

    });
  }


}
