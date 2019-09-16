import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {
    username: 'john',
    password: 'password'
  };

  constructor(private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  Login() {
    this.authService.Login(this.model)
    .subscribe( next => {
      this.alertify.success('Logged in successfully!');
    }, error => {
      this.alertify.error(error);
    });
  }

  LoggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  Logout() {
    localStorage.removeItem('token');
    this.alertify.message('Logged out');
  }
}
