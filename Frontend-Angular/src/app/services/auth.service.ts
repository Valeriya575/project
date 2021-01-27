import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserRegister, UserLogin } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerURL = 'http://localhost:3000/api/v1/users';
  private AuthURL = 'http://localhost:3000/api/v1/auth';

  public token: string;
  public username: string;

  constructor(
    private http: HttpClient
  ) { }

  public register(user: UserRegister) {
    return this.http.post<UserRegister>(this.registerURL, user);
  }

  public login(user: UserLogin) {
    return this.http.post<UserLogin>(this.AuthURL, user);
  }

  public logout() {
    this.token = null;
    this.username = null;
  }

  public saveUser(data, username: string) {
    this.token = data['token'];
    this.username = username;
  }

}
