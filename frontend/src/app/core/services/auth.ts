import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from './category';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated = signal(false);

  constructor(private http: HttpClient, private categoryService: CategoryService) {
    this.checkAuthentication();
  }

  register( username: string, password: string ) {
    return this.http.post(
      'http://localhost:3000/api/auth/register',
      {username, password}
    );
  }

  login( username: string, password: string ) {
    return this.http.post<{
      token: string
    }>(
      'http://localhost:3000/api/auth/login',
      { username, password }
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  checkAuthentication(): void {
    const token = localStorage.getItem('token');
    this.isAuthenticated.set(!!token);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.categoryService.selectedCategoryId.set(0);
    this.isAuthenticated.set(false);
  }

}