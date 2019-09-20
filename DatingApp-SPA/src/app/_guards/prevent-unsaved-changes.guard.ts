import { Injectable } from '@angular/core';
import { Router, CanDeactivate } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<MemberEditComponent> {
  /**
   * This is the guard to protect the user from navigating
   * to another route when changes have been made to edit form
   */
  canDeactivate(component: MemberEditComponent): boolean {
    if (component.editForm.dirty) {
      return confirm('Are you sure you want to leave the edit page? All unsaved changes  will be lost!');
    }
    return true;
  }
}
