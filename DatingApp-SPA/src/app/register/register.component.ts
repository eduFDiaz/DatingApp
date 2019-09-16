import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = {};
  @Input() valuesFromHome: any;
  @Output() cancelRegister = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  Register() {
    console.log(this.model);
  }

  Cancel() {
    console.log('Canceled');
    this.cancelRegister.emit(false);
  }

}
