import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { faqService } from '../../core/services/faq';
import { AuthService } from '../../core/services/auth';
import { RouterLink } from '@angular/router';

export interface Faq {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  imports: [CommonModule, RouterLink],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class FaqComponent {

  activeIndex: number | null = null;
  allFaqs = signal<Faq[]>([]);

  constructor(private faqService: faqService, private auth: AuthService){}

  toggleFaq(index: number) {
    if (this.activeIndex === index) {
      this.activeIndex = null; // chiude l’accordion se cliccato di nuovo
    } else {
      this.activeIndex = index; // apre l’item cliccato
    }
  }

  ngOnInit() {
    this.faqService.getFaqs().subscribe(faqs => this.allFaqs.set(faqs));
  }
}