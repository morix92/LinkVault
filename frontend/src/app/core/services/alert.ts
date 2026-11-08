import { Injectable, signal } from '@angular/core';

export interface AlertData {
  message: string;
  classAlert: 'success' | 'error' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private _alert = signal<AlertData | null>(null);
  readonly alert = this._alert.asReadonly();

  showAlert(alert: AlertData, timeout = 4000): void {
    this._alert.set(alert);
    setTimeout(() => {
      if (this._alert() === alert) {
        this._alert.set(null);
      }
    }, timeout);
  }

}
