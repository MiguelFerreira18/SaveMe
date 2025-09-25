import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateCurrencyDto, Currency } from './shared/models/currency.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CurrenciesService {
  private readonly apiUrl = `${environment.apiUrl}/api/currency`;
  constructor(private http: HttpClient) {}

  getCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${this.apiUrl}/all`, { withCredentials: true });
  }

  postCurrencies(currency: CreateCurrencyDto): Observable<Currency> {
    return this.http.post<Currency>(this.apiUrl, currency, { withCredentials: true });
  }
}
