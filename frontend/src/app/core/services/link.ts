import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor(private http: HttpClient) {}

  getLinks() {
    return this.http.get<any[]>(
      'http://localhost:3000/api/links'
    );
  }


  createLink( title: string, url: string, categoryId: number, description?: string ) {
    return this.http.post('http://localhost:3000/api/links',
      {
        title,
        url,
        categoryId,
        description
      }
    );
  }


  updateLink( id: number, title: string, url: string, categoryId: number, description?: string, imageUrl?: string ) {
    return this.http.put(`http://localhost:3000/api/links/${id}`,
      {
        title,
        url,
        categoryId,
        description,
        imageUrl,
      }
    );
  }

  deleteLink(id: number) {
    return this.http.delete(`http://localhost:3000/api/links/${id}`);
  }

}