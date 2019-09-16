import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = {};
  @Output() cancelRegister = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  Register() {
    console.log(this.model);
    this.authService.Register(this.model).subscribe(
      response => {
        this.alertify.success('registration successful');
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

  Cancel() {
    this.cancelRegister.emit(false);
  }

}
