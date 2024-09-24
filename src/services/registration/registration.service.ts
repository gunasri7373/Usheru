import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private baseUrl = 'https://api.first.org/data/v1/';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/countries`);
  }
  geAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/teams`);
  }
  registerUser(username: string, country: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, {
      username,
      country,
    });
  }
}
