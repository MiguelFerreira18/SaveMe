import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateExpenseDto, Expense } from '../shared/models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private readonly apiUrl = `${environment.apiUrl}/api/expense`;
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/all`, { withCredentials: true });
  }

  postExpense(expense: CreateExpenseDto): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense, { withCredentials: true });
  }
}
