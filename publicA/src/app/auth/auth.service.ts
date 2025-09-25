import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { SignIn, SignUp, UserView } from '../shared/models/user.model';

interface IsAuthenticated {
  authenticated: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth/public`;
  private isLoggedIn = false;

  constructor(private http: HttpClient) {}

  checkStatus(): Observable<boolean> {
    return this.http
      .get<IsAuthenticated>(`${this.apiUrl}/status`, {
        withCredentials: true,
      })
      .pipe(
        map((res) => {
          this.isLoggedIn = res.authenticated;
          return this.isLoggedIn;
        }),
        catchError(() => of(false))
      );
  }

  authenticate(user: SignIn): Observable<UserView> {
    return this.http.post<UserView>(`${this.apiUrl}/login`, user, { withCredentials: true });
  }

  signUp(user: SignUp): Observable<UserView> {
    return this.http.post<UserView>(`${this.apiUrl}/signup`, user, { withCredentials: true });
  }

  public get authenticated(): boolean {
    return this.isLoggedIn;
  }
}
