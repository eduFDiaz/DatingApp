import { Message } from './../_models/Message';
import { AuthService } from './../_services/auth.service';
import { catchError } from 'rxjs/operators';
import { User } from '../_models/User';
import { Injectable } from '@angular/core';

import { Resolve, ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';

import { UserService } from '../_services/user.service';
import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class MemberMessagesResolver implements Resolve<Message[]>{
  constructor(private userService: UserService, private alertify: AlertifyService,
              private router: Router, private spinner: NgxSpinnerService,
              private authService: AuthService) {
}

resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
  return this.userService.GetMessagesThread(this.authService.loggedInUser.id, +route.params.id).pipe(
    catchError( error => {
        this.alertify.error('Problem retrieving the data');
        this.router.navigate(['/members']);
        return of(null);
    })
  );
}
}
