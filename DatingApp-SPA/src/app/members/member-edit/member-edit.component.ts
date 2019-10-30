import { Component, OnInit, ViewChild, HostListener, NgModule } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/_models/User';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from './../../_services/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  editForm: FormGroup;
  user: User;
  isDataLoaded = false;

  editorStyle = {
    height: '800px'
  };

  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }],               // custom button values
      [{ list: 'ordered'}, { list: 'bullet' }],
      [{ script: 'sub'}, { script: 'super' }],      // superscript/subscript
      [{ indent: '-1'}, { indent: '+1' }],          // outdent/indent
      [{ direction: 'rtl' }],                         // text direction

      [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'],                                         // remove formatting button

      ['link', 'image', 'video']
    ]
  };

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  constructor(private userService: UserService,
              private alertify: AlertifyService,
              private authService: AuthService,
              private spinner: NgxSpinnerService,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.spinner.show();
    this.loadUser();
  }

  initForm() {
    this.editForm = this.fb.group({
      introduction : [this.user.introduction],
      lookingFor : [this.user.lookingFor],
      interests : [this.user.interests],
      city : [this.user.city],
      country : [this.user.country],
    });
  }

  loadUser() {
    this.userService.getUser(this.authService.decodedToken.nameid).subscribe((user: User) => {
      this.user = user;
      this.authService.photoUrl.subscribe(photo => this.user.photoUrl = photo);
    }, error => this.alertify.error(error)
    , () => {
      this.initForm();
      this.isDataLoaded = true;
    });
  }

  updateUser() {
    this.user.introduction  = this.editForm.get('introduction').value;
    this.user.lookingFor  = this.editForm.get('lookingFor').value;
    this.user.interests  = this.editForm.get('interests').value;
    this.user.city  = this.editForm.get('city').value;
    this.user.country  = this.editForm.get('country').value;
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
