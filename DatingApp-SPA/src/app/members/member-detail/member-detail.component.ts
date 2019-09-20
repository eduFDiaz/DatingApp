import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/User';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User;
  isDataLoaded = false;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userService: UserService,
              private alertify: AlertifyService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.LoadUser();
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
    },
    // max-width 800
    {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
    },
    // max-width 400
    {
        breakpoint: 400,
        preview: false
    }
    ];
  }

  LoadUser() {
    this.userService.getUser(+this.route.snapshot.params.id)
      .subscribe(
        (user: User) => {
          this.user = user;
          this.galleryImages = this.getImages();
        }
        , error => this.alertify.error(error)
        , () => {
          this.isDataLoaded = true;
        }
      );
  }

  getImages() {
    const imageUrls = [];
    this.user.photos.forEach(pic => {
      imageUrls.push(
        {
          small: pic.url,
          medium: pic.url,
          big: pic.url,
          description: pic.description
        });
      });
    return imageUrls;
  }
}
