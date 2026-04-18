import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CemosUser {
  id: number;
  username: string;
  perfil: string;
  is_staff: boolean;
  is_active: boolean;
}

export interface CemosLoginResponse {
  access: string;
  refresh: string;
  user?: CemosUser;
}

@Injectable({ providedIn: 'root' })
export class CemosAuthService {
  private readonly baseUrl = 'https://cemos2028.com';

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<CemosLoginResponse> {
    return this.http.post<CemosLoginResponse>(`${this.baseUrl}/api/auth/login/`, {
      username,
      password
    });
  }
}
