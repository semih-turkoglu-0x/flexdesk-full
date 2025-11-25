import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap, map, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          this.currentUserSubject.next(JSON.parse(storedUser));
        }
        
        this.verifyToken(token).subscribe({
          next: (email) => {
            const user = { email, username: email };
            this.currentUserSubject.next(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
          },
          error: () => {
            this.logout();
          }
        });
      } else {
        this.logout();
      }
    }
  }

  register(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { responseType: 'text' }).pipe(
      tap((token: string) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', token);
        }
      }),
      switchMap((token: string) => {
        return this.verifyToken(token).pipe(
          tap((email: string) => {
            const user = { email, username: email };
            this.currentUserSubject.next(user);
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('currentUser', JSON.stringify(user));
            }
          })
        );
      })
    );
  }

  verifyToken(token: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/verify-token`, token, { responseType: 'text' });
  }

  me(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        return this.verifyToken(token).pipe(
          map((email: string) => {
            const user = { email, username: email };
            this.currentUserSubject.next(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
          })
        );
      }
    }
    return of(null);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
