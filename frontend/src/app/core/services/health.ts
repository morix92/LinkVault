import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthService {

  private readonly healthUrl =
    'http://localhost:3000/health';

  constructor(
    private http: HttpClient
  ) {}

  getHealth(): Observable<any> {

    return this.http.get(this.healthUrl);
  }

}