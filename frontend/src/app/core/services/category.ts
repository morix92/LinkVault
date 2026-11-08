import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  selectedCategoryId = signal<number>(0);
  categories = signal<{ id: number; name: string }[]>([]);

  constructor(private http: HttpClient) {}

  loadCategories(): void {
    this.getCategories().subscribe({
      next: categories => {
        this.categories.set(categories);
      }
    });
  }

  getCategories() {
    return this.http.get<
      {id: number; name: string;}[]
    >('http://localhost:3000/api/categories');
  }

  createCategory(name: string) {
    return this.http.post(
      'http://localhost:3000/api/categories',
      {
        name
      }
    );
  }

  updateCategory(id: number, name: string) {
    return this.http.put(
      `http://localhost:3000/api/categories/${id}`,
      {name}
    );
  }
  
  deleteCategory(id: number) {
    return this.http.delete(
      `http://localhost:3000/api/categories/${id}`
    );
  }
}