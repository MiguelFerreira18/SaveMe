import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateIncomeDto, Income } from '../shared/models/income.model';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private readonly apiUrl = ` ${environment.apiUrl}/api/income`;
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  getIncome(): Observable<Income[]> {
    return this.http.get<Income[]>(`${this.apiUrl}/all`, { withCredentials: true });
  }

  postIncome(income: CreateIncomeDto): Observable<Income> {
    return this.http.post<Income>(this.apiUrl, income, { withCredentials: true });
  }
}
