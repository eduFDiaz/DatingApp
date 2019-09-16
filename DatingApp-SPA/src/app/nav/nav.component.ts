import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  Login() {
    console.log(this.model);
  }

}
