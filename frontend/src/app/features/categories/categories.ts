import { Component, computed, signal } from '@angular/core';
import { CategoryService } from '../../core/services/category';
import { AlertService } from '../../core/services/alert';

export interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class CategoriesComponent {

  showCreateModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  newCategoryName = signal('');
  editCategoryName = signal('');
  displayedCategories = computed(() => [{id: 0,name: 'Tutte'}, ...this.categoryService.categories()]);
  selectedCategory = computed(() => { return this.displayedCategories().find(c => c.id === this.categoryService.selectedCategoryId());});
  categoryTouched = signal(false);
  editCategoryTouched = signal(false);

  constructor(protected categoryService: CategoryService, private alertService: AlertService) {}

  ngOnInit() {
    this.categoryService.loadCategories();
  }

  selectCategory(id: number): void {
    this.categoryService.selectedCategoryId.set(id);
  }

  canEditSelectedCategory(): boolean {
    const selectedId = this.categoryService.selectedCategoryId();
    const selectedCategory = this.categoryService.categories().find(c => c.id === selectedId);

    return !!selectedCategory && selectedCategory.id !== 0 && selectedCategory.name !== 'Default';
  }

  createCategory() {
    this.categoryService.createCategory(this.newCategoryName()).subscribe({
      next: () => {
        this.alertService.showAlert({
          message:'Categoria creata correttamente',
          classAlert: 'success'
        });

        this.categoryService.loadCategories();
        this.categoryTouched.set(false);
        this.showCreateModal.set(false);
        this.newCategoryName.set('');
      }
    });
  }

  openEditModal(): void {
    const category = this.selectedCategory();

    if (!category) {
      return;
    }

    this.editCategoryName.set(category.name);
    this.editCategoryTouched.set(false);
    this.showEditModal.set(true);
  }

  updateCategory(): void {
    const category = this.selectedCategory();

    if (!category) {
      return;
    }

    this.categoryService.updateCategory(category.id, this.editCategoryName()).subscribe({
      next: () => {
        this.alertService.showAlert({
            message:'Categoria aggiornata correttamente',
            classAlert:'success'
        });

        this.categoryService.loadCategories();
        this.editCategoryTouched.set(false);
        this.showEditModal.set(false);
      }
    });
  }

  deleteCategory(): void {
    const category = this.selectedCategory();

    if (!category) {
      return;
    }

    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {

        this.alertService.showAlert({
          message:'Categoria eliminata correttamente',
          classAlert:'success'
        });

        this.categoryService.loadCategories();
        this.categoryService.selectedCategoryId.set(0);
        this.showDeleteModal.set(false)      
      }
    });
  }

}