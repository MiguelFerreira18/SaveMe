import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateStrategyTypeDto, StrategyType } from '../shared/models/strategy-type.model';

@Injectable({
  providedIn: 'root',
})
export class StrategyTypeService {
  private readonly apiUrl = `${environment.apiUrl}/api/strategy-type`;
  private http = inject(HttpClient);

  constructor() {}

  getStrategyTypes(): Observable<StrategyType[]> {
    return this.http.get<StrategyType[]>(`${this.apiUrl}/all`, { withCredentials: true });
  }

  postStrategyType(strategyType: CreateStrategyTypeDto): Observable<StrategyType> {
    return this.http.post<StrategyType>(this.apiUrl, strategyType, { withCredentials: true });
  }
}
