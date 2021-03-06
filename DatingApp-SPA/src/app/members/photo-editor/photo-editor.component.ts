import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from './../../_services/auth.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/Photo';
import { FileUploader } from 'ng2-file-upload';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  currentMainPhoto: Photo;

  constructor(private authService: AuthService, private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + this.authService.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 15 * 1024 * 1024
    });
    // This fixes a CORS bug
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
        if (photo.isMain) {
          this.authService.changeMemberPhoto(photo.url);
          this.authService.loggedInUser.photoUrl = photo.url;
        }
      }
    };
  }

  setAsMainPhoto(photo: Photo) {
    this.userService.setAsMainPhoto(this.authService.decodedToken.nameid, photo.id)
      .subscribe(() => {
        this.currentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
        this.currentMainPhoto.isMain = false;
        photo.isMain = true;
        this.authService.changeMemberPhoto(photo.url);
      }, error => { this.alertify.error(error); }
        , () => { });
  }

  DeletePhoto(photo: Photo) {
    this.alertify.confirm('Are you sure you want to delete the photo with id: ' + photo.id.toString() + '?',
    () => {
      return this.deletePicture(photo);
    });
  }

  deletePicture(photo: Photo) {
    this.userService.DeletePhoto(this.authService.decodedToken.nameid, photo.id)
      .subscribe(() => {
        const id = this.photos.indexOf(photo);
        this.photos = this.photos.filter((data, idx) => idx !== id);
        this.alertify.success('Photo deleted successfully!');
      }, error => { this.alertify.error(error); }
        , () => { });
  }
}
