import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

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

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  Login() {
    this.authService.Login(this.model)
    .subscribe( next => {
      console.log('Logged in successfully!');
    }, error => {
      console.log('Failed to logged in!');
    });
  }

  LoggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  Logout() {
    localStorage.removeItem('token');
    console.log('Logged out');
  }
}
