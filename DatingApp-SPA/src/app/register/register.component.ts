import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = {};
  @Input() valuesFromHome: any;

  constructor() { }

  ngOnInit() {
  }

  Register() {
    console.log(this.model);
  }

  Cancel() {
    console.log('Canceled');
  }

}
