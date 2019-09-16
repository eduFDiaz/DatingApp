import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  values: any;
  registerMode = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  RegisterToggle() {
    // this.registerMode = !this.registerMode;
    this.registerMode = true;
  }

  CancelRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode;
  }
}
