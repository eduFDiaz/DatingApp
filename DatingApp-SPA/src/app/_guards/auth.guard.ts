import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  /**
   * This is the guard to protect routes when user is
   * not logged in
   */
  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router) {
  }
  canActivate(): boolean {
    if (this.authService.LoggedIn()) {
      return true;
    } else {
      this.alertify.error('You shall not pass!!!');
      this.router.navigate(['home']);
      return false;
    }
  }
}
