import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Token, User, UserRegister } from '../models/user.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
  ) {
  }

  create(user: UserRegister): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, user);
  }

  login(user: User): Observable<Token> {
    return this.http.post<Token>(`${environment.apiUrl}/login`, user);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  deleteUser(id: string): Observable<null> {
    return this.http.delete<null>(`${environment.apiUrl}/users/${id}`);
  }

  editUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/${id}`, user);
  }
}
