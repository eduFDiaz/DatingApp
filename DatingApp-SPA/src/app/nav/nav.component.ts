import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isDarkTheme = false;

  model: any = {
    username: '',
    password: ''
  };
  photoUrl: string;

  constructor(public authService: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  Login() {
    this.authService.Login(this.model)
    .subscribe( next => {
      this.alertify.success('Logged in successfully!');
    }, error => {
      this.alertify.error(error);
    }, () => {
      this.router.navigate(['members']);
    });
  }

  LoggedIn() {
    return this.authService.LoggedIn();
  }

  Logout() {
    this.authService.Logout();
    this.alertify.message('Logged out');
    this.router.navigate(['home']);
  }

  changeTheme(): void {
    if (this.isDarkTheme) {
       document.getElementById('global-theme').setAttribute('href', 'assets/styles/united/bootstrap.min.css');
       this.isDarkTheme = false;
    } else {
       document.getElementById('global-theme').setAttribute('href', 'assets/styles/darkly/bootstrap.min.css');
       this.isDarkTheme = true;
    }
 }
}
