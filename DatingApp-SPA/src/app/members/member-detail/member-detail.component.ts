import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';

import { User } from 'src/app/_models/User';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;

  constructor(private userService: UserService,
              private alertify: AlertifyService,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.spinner.show();
    this.route.data.subscribe( data => {
      this.user = data.user;
      this.galleryImages = this.getImages();
    });

    this.route.queryParams.subscribe(params => {
      const selectedTab = params['tab'];
      console.log(selectedTab);
      this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0 ].active = true;
    });
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
          this.route.queryParams.subscribe(params => {
            const selectedTab = params.tab;
            this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
          });
        }
        , error => this.alertify.error(error)
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

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }
}
