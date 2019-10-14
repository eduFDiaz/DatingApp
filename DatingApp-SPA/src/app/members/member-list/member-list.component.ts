import { AuthService } from './../../_services/auth.service';
import { PaginatedResult, Pagination } from './../../_models/pagination';
import { User } from '../../_models/User';
import { UserService } from '../../_services/user.service';
import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../_services/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  isDataLoaded: boolean;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  user: User;
  userParams: any = {};

  constructor(private userService: UserService, private alertify: AlertifyService,
              private spinner: NgxSpinnerService, private authService: AuthService) {
  }

  ngOnInit() {
    this.spinner.show();
    this.user = this.authService.loggedInUser;
    this.pagination = { currentPage: 1, itemsPerPage: 5, totalItems: null, totalPages: null};
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
    this.userParams.likers = 'false';
    this.userParams.likees = 'false';
    this.loadUsers();
  }

  resetFilters() {
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
    this.userParams.likers = 'false';
    this.userParams.likees = 'false';
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
    .subscribe((response: PaginatedResult<User[]>) => {
        this.users = response.result;
        this.pagination = response.pagination;
        this.isDataLoaded = true;
      }
      , error => {this.alertify.error(error); this.isDataLoaded = !this.isDataLoaded; }
    );
  }

  pageChanged(event: any) {
    // this.isDataLoaded = !this.isDataLoaded;
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
}
