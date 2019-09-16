import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = {};
  @Output() cancelRegister = new EventEmitter<boolean>();

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  Register() {
    console.log(this.model);
    this.authService.Register(this.model).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error.error);
      }
    );
  }

  Cancel() {
    console.log('Canceled');
    this.cancelRegister.emit(false);
  }

}
