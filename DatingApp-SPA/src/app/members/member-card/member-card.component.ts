import { LikeResult } from 'src/app/_models/LikeResult';
import { AlertifyService } from './../../_services/alertify.service';
import { UserService } from './../../_services/user.service';
import { AuthService } from './../../_services/auth.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/_models/User';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  @Output() likeEvent = new EventEmitter<User>();
  constructor(private authService: AuthService,
              private userService: UserService,
              private alertify: AlertifyService) { }
  ngOnInit() {
  }

  Like() {
    const id = this.authService.loggedInUser.id;
    this.userService.SendLike(id, this.user.id).subscribe(
    (response: LikeResult) => {
      if (response.result === 'like') {
        this.alertify.success('You liked ' + this.user.knownAs + ' 👍');
      }
      if (response.result === 'unlike') {
        this.alertify.success('You unliked ' + this.user.knownAs + ' 👎');
      }
      this.likeEvent.emit(this.user);
    }, error => {
      this.alertify.error(error);
    });
  }
}
