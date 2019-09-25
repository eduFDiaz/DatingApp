import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  token: string;
  loggedInUser: User;

  constructor(private http: HttpClient) {
    this.AutoLogin();
  }

  AutoLogin() {
    this.token = localStorage.getItem('token');
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (this.token && this.loggedInUser) {
      this.decodedToken = this.jwtHelper.decodeToken(this.token);
    }
  }

  Login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => {
          if (response) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.decodedToken = this.jwtHelper.decodeToken(response.token);
            this.loggedInUser = response.user;
          }
        })
      );
  }

  Register(model: any) {
    return this.http.post(this.baseUrl + 'register', model);
  }

  LoggedIn() {
    this.token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(this.token);
  }

  Logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.decodedToken = null;
    this.token = null;
    this.loggedInUser = null;
  }
}
