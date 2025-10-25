import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateInvestmentDto, Investment } from '../shared/models/investment.model';
import { Income } from '../shared/models/income.model';

@Injectable({
  providedIn: 'root',
})
export class InvestmentService {
  private readonly apiUrl = `${environment.apiUrl}/api/investment`;
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  getInvestments(): Observable<Investment[]> {
    return this.http.get<Investment[]>(`${this.apiUrl}/all`, { withCredentials: true });
  }
  postInvestments(investment: CreateInvestmentDto): Observable<Investment> {
    return this.http.post<Investment>(this.apiUrl, investment, { withCredentials: true });
  }
}
