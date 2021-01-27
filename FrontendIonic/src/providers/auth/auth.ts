import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRegister, UserLogin } from '../../models/user';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

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
