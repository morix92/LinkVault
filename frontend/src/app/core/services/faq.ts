import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Faq {
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root',
})
export class faqService {

  constructor(private http : HttpClient){}

  getFaqs(): Observable<Faq[]> {
    return this.http.get<Faq[]>('faq/faq.it.json');
  }


}
