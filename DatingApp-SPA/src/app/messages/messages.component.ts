import { Message } from './../_models/Message';
import { Pagination, PaginatedResult } from './../_models/pagination';
import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  isDataLoaded = false;
  user: User;
  messageContainer = null;

  constructor(private userService: UserService, private alertify: AlertifyService,
              private spinner: NgxSpinnerService, private authService: AuthService) {
  }

  ngOnInit() {
    this.spinner.show();
    this.user = this.authService.loggedInUser;
    this.pagination = { currentPage: 1, itemsPerPage: 5, totalItems: null, totalPages: null};
    this.loadMessages();
  }

  loadMessages() {
    this.userService.GetMessages(this.user.id, this.pagination.currentPage,
                                 this.pagination.itemsPerPage, this.messageContainer)
    .subscribe((response: PaginatedResult<Message[]>) => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.isDataLoaded = true;
      }
      , error => {this.alertify.error(error); this.isDataLoaded = !this.isDataLoaded; }
    );
  }

  pageChanged(event: any) {
    // this.isDataLoaded = !this.isDataLoaded;
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  DeleteMessage(messageId: number) {
    this.alertify.confirm('Are you sure you want to delete this message', () => {
      this.userService.DeleteMessage(messageId).subscribe(
        () => {
          const index = this.messages.findIndex(el => el.id === messageId);
          this.messages.splice(index, 1);
          this.alertify.success('The message was deleted');
        }
      , error => this.alertify.error('Failed to delete the message') );
    });
  }
}
