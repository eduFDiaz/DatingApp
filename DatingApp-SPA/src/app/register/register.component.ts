import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/ngx-bootstrap-datepicker';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = {};
  registerForm: FormGroup;
  @Output() cancelRegister = new EventEmitter<boolean>();

  // Partial is used because you want to make the config optional
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private authService: AuthService, private alertify: AlertifyService, private fb: FormBuilder) { }

  ngOnInit() {
      this.bsConfig = {
        containerClass: 'theme-red'
      };
      this.createRegisterForm();
  }

  // A custom validator is just a function in angular reactive forms
  matchPasswordValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {mismatch: true};
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(10)]],
      confirmPassword: ['', Validators.required],
      gender: ['male', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    }, {validator: this.matchPasswordValidator});
  }

  Register() {
      this.authService.Register(this.registerForm.value).subscribe(
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
