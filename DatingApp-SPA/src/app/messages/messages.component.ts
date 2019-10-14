import { Pagination, PaginatedResult } from './../_models/pagination';
import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/Message';
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
  isDataLoaded: boolean;
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
        console.log(response.result);
      }
      , error => {this.alertify.error(error); this.isDataLoaded = !this.isDataLoaded; }
    );
  }

  pageChanged(event: any) {
    // this.isDataLoaded = !this.isDataLoaded;
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

}
