import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateWishDto, Wish } from '../shared/models/wish.model';

@Injectable({
  providedIn: 'root',
})
export class WishService {
  private readonly apiUrl = `${environment.apiUrl}/api/wish`;
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  getWishes(): Observable<Wish[]> {
    return this.http.get<Wish[]>(`${this.apiUrl}/all`, { withCredentials: true });
  }
  postWishes(wish: CreateWishDto): Observable<Wish> {
    return this.http.post<Wish>(this.apiUrl, wish, { withCredentials: true });
  }
}
