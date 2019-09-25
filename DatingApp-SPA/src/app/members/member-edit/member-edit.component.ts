import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/_models/User';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from './../../_services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', {static: false}) editForm: NgForm;
  user: User;
  isDataLoaded = false;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  constructor(private userService: UserService,
              private alertify: AlertifyService,
              private authService: AuthService,
              private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.spinner.show();
    this.loadUser();
  }

  loadUser() {
    this.userService.getUser(this.authService.decodedToken.nameid).subscribe((user: User) => {
      this.user = user;
      this.authService.photoUrl.subscribe(photo => this.user.photoUrl = photo);
    }, error => this.alertify.error(error)
    , () => { this.isDataLoaded = true; });
  }

  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(
      (response: User) => {
        this.alertify.success('Your profile has been updated!');
        this.editForm.reset(this.user);
      }
    , error => { this.alertify.error(error); }
    , () => { this.isDataLoaded = true; }
    );
  }

  updateMainPhoto(photoUrl: string) {
    this.user.photoUrl = photoUrl;
  }
}
