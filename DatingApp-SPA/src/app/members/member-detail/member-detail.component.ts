import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/User';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User;
  isDataLoaded = false;

  constructor(private userService: UserService,
              private alertify: AlertifyService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.LoadUser();
  }

  LoadUser() {
    this.userService.getUser(+this.route.snapshot.params.id)
    .subscribe(
      (user: User) => { this.user = user; this.isDataLoaded = true; }
      , error => this.alertify.error(error));
  }
}
