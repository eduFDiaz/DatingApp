import { Photo } from 'src/app/_models/Photo';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  token: string;
  loggedInUser: User;

  // The service will use a behavior subject so any component can subscribe to changes emitted by it
  photoUrl = new BehaviorSubject<string>('https://www.bsn.eu/wp-content/uploads/2016/12/user-icon-image-placeholder-300-grey.jpg');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) {
    this.AutoLogin();
  }

  changeMemberPhoto(photoUrl: string) {
    this.loggedInUser.photoUrl = photoUrl;
    localStorage.setItem('user', JSON.stringify(this.loggedInUser));
    this.photoUrl.next(photoUrl);
  }

  AutoLogin() {
    this.token = localStorage.getItem('token');
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (this.token && this.loggedInUser) {
      this.decodedToken = this.jwtHelper.decodeToken(this.token);
      this.changeMemberPhoto(this.loggedInUser.photoUrl);
    }
  }

  Login(user: User) {
    return this.http.post(this.baseUrl + 'login', user)
      .pipe(
        map((response: any) => {
          if (response) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.decodedToken = this.jwtHelper.decodeToken(response.token);
            this.loggedInUser = response.user;
            this.changeMemberPhoto(this.loggedInUser.photoUrl);
          }
        })
      );
  }

  Register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
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
