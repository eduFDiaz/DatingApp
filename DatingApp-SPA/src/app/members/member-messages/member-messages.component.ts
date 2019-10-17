import { NgForm, FormGroup } from '@angular/forms';
import { AuthService } from './../../_services/auth.service';
import { User } from './../../_models/User';
import { Message } from './../../_models/Message';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  sender: User;
  messageThread: Message[];
  isDataLoaded = false;
  newMessage: any = {};

  constructor(private authService: AuthService,
              private userService: UserService,
              private alertify: AlertifyService,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.sender = this.authService.loggedInUser;
    this.loadMessageThread();
  }

  loadMessageThread() {
    this.userService.GetMessagesThread(this.sender.id, this.recipientId)
    .subscribe( response => {
      this.messageThread = response;
      this.isDataLoaded = true;
    },
    error => { this.alertify.error(error); });
  }

  sendNewMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.SendMessage(this.sender.id, this.newMessage).subscribe(
      (response: Message) => {
        console.log(response);
        this.messageThread.unshift(response);
        this.newMessage = '';
      },
      error => { this.alertify.error(error); });
  }

}
