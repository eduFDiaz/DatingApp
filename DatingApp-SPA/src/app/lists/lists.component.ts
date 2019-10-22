import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  isDataLoaded: boolean;

  user: User;
  userParams: any = {};
  likesParam = 'Likees';

  constructor(private userService: UserService, private alertify: AlertifyService,
              private spinner: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit() {
    this.spinner.show();
    this.user = this.authService.loggedInUser;
    this.pagination = { currentPage: 1, itemsPerPage: 5, totalItems: null, totalPages: null};
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam)
    .subscribe((response: PaginatedResult<User[]>) => {
      this.users = response.result;
      this.pagination = response.pagination;
      this.isDataLoaded = true;
    }, error => {
      this.alertify.error(error);
      this.isDataLoaded = ! this.isDataLoaded;
    });
  }

  pageChanged(event: any) {
    // this.isDataLoaded = !this.isDataLoaded;
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  likeEventHandler($event: User) {
    this.loadUsers();
  }

}
