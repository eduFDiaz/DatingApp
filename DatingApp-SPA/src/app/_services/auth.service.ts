import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  token: string;

  constructor(private http: HttpClient) {
    this.AutoLogin();
  }

  AutoLogin() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.decodedToken = this.jwtHelper.decodeToken(this.token);
    }
  }

  Login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            console.log(this.decodedToken);
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
    this.decodedToken = null;
    this.token = null;
  }
}
