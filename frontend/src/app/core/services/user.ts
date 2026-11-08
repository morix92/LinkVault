import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) {}

  getProfile() {

    return this.http.get<{
      id: number;
      username: string;
    }>(
      'http://localhost:3000/api/users/me'
    );
  }


  updateProfile(username: string,password?: string) {

    const body: { username: string; password?: string; } = {
      username
    };

    if (password) {
      body.password = password;
    }

    return this.http.put(
      'http://localhost:3000/api/users/me',
      body
    );
  }

  
  deleteProfile() {

    return this.http.delete(
      'http://localhost:3000/api/users/me'
    );
  }

}
