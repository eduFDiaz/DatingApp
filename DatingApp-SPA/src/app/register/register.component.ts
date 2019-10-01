import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = {};
  registerForm: FormGroup;
  @Output() cancelRegister = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(10)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, this.matchPasswordValidator);
  }

  // A custom validator is just a function in angular reactive forms
  matchPasswordValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {mismatch: true};
  }

  Register() {
    console.log(this.registerForm.value);
    /* this.authService.Register(this.model).subscribe(
      response => {
        this.alertify.success('registration successful');
      },
      error => {
        this.alertify.error(error);
      }
    ); */
  }

  Cancel() {
    this.cancelRegister.emit(false);
  }

}
