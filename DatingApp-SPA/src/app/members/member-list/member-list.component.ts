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

  constructor(private userService: UserService, private alertify: AlertifyService,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinner.show();
    this.pagination = { currentPage: 1, itemsPerPage: 5, totalItems: null, totalPages: null};
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage)
    .subscribe((response: PaginatedResult<User[]>) => {
      this.users = response.result;
      this.pagination = response.pagination;
      console.log(this.pagination);
      this.isDataLoaded = true;
    }, error => this.alertify.error(error));
  }

  pageChanged(event: any) {
    // this.isDataLoaded = !this.isDataLoaded;
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
}
