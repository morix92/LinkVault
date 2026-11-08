import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AlertService } from '../services/alert';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertService);

  return next(req).pipe(
    catchError(
      (error:HttpErrorResponse) => {
        const message = error.error?.message ?? 'Errore inatteso';
        alertService.showAlert({
          message,
          classAlert: 'error'
        });

        return throwError(() => error);
      }
    )
  );
};