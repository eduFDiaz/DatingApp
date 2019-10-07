import { PaginatedResult } from './../../_models/pagination';
import { User } from '../../_models/User';
import { UserService } from '../../_services/user.service';
import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  pageNumber = 1;
  pageSize = 5;
  constructor(private userService: UserService, private alertify: AlertifyService) {
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.pageNumber, this.pageSize).subscribe((response: PaginatedResult<User[]>) => {
      this.users = response.result;
    }, error => this.alertify.error(error));
  }
}
