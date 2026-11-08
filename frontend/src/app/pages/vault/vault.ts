import { Component, computed, signal, effect } from '@angular/core';
import { CategoriesComponent } from '../../features/categories/categories';
import { LinkService } from '../../core/services/link';
import { CategoryService } from '../../core/services/category';
import { AlertService } from '../../core/services/alert';

export interface Link {
  id: number;
  title: string;
  description: string | null;
  url: string;
  image_url: string;
  category_id: number;
  category_name: string;
}

@Component({
  selector: 'app-vault',
  imports: [CategoriesComponent],
  templateUrl: './vault.html',
  styleUrl: './vault.css',
})
export class VaultComponent {

  titleTouched = signal(false);
  urlTouched = signal(false);

  gridView = signal(true);
  links = signal<Link[]>([]);
  
  editCategoryName = signal('');
  showCreateModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  linkToDelete = signal<Link | null>(null);
  selectedLink = signal<Link | null>(null);
  title = signal('');
  url = signal('');
  description = signal('');
  categoryId = signal(0);
  imageUrl = signal('');

  filteredLinks = computed(() => {
    const selectedCategory = this.categoryService.selectedCategoryId();
    const allLinks = this.links();

    if ( selectedCategory === null || selectedCategory === 0 ) {
      return allLinks;
    }

    return allLinks.filter( link => link.category_id === selectedCategory );
  });

  constructor(private linkService: LinkService, protected categoryService: CategoryService, private alertService: AlertService) {
    effect(() => {
      const categories = this.categoryService.categories();
      if (categories.length) {
        this.loadLinks();
      }
    });
  
  }

  loadLinks() {
    this.linkService.getLinks().subscribe({
      next: (links) => {
        this.links.set(links);
      }
    });
  }

  setGridView(): void {
    this.gridView.set(true);
  }

  setListView(): void {
    this.gridView.set(false);
  }

  createLink(): void {
    this.linkService.createLink(this.title(),this.url(),this.categoryId(),this.description()).subscribe({
      next: () => {
        
        this.alertService.showAlert({
          message:'Link creato correttamente',
          classAlert:'success'
        });

        this.loadLinks();
        this.categoryService.selectedCategoryId.set(this.categoryId());
        this.resetTouchedFields();
        this.showCreateModal.set(false);
      }
    });
  }

  updateLink(): void {
    const link =this.selectedLink();

    if (!link) {
      return;
    }

    this.linkService.updateLink(link.id, this.title(), this.url(), this.categoryId(), this.description(), this.imageUrl()).subscribe({
      next: () => {

        this.alertService.showAlert({
          message:'Link modificato correttamente',
          classAlert:'success'
        });

        this.loadLinks();
        this.categoryService.selectedCategoryId.set(this.categoryId());
        this.resetTouchedFields();
        this.showEditModal.set(false);
      }
    });
  }

  openLink(link: Link): void {
    window.open(link.url,'_blank');
  }

  openCreateModal(): void {
    this.title.set('');
    this.url.set('')
    this.description.set('');
    this.showCreateModal.set(true);

    const firstCategory = this.categoryService.categories()[0];
    if (firstCategory) {
      this.categoryId.set(firstCategory.id);
    }
  }

  resetTouchedFields() {
    this.titleTouched.set(false);
    this.urlTouched.set(false);
  }

  openEditModal(link: Link): void {
    this.selectedLink.set(link);
    this.title.set(link.title);
    this.url.set(link.url);
    this.description.set(link.description ?? '');
    this.categoryId.set(link.category_id);
    this.imageUrl.set(link.image_url ?? '');
    this.showEditModal.set(true);
  }

  openDeleteModal(link: Link): void {
    this.linkToDelete.set(link);
    this.showDeleteModal.set(true);
  }

  closeEditModal(): void {
    this.selectedLink.set(null);
    this.resetTouchedFields();
    this.showEditModal.set(false);
  }

  closeDeleteModal(): void {
    this.linkToDelete.set(null);
    this.showDeleteModal.set(false);
  }


  confirmDeleteLink(): void {
    const link = this.linkToDelete();

    if (!link) {
      return;
    }

    this.linkService.deleteLink(link.id).subscribe({
      next: () => {

        this.alertService.showAlert({
          message:'Link eliminato correttamente',
          classAlert:'success'
        });

        this.loadLinks();
        this.closeDeleteModal();
      }
    });
  }

}