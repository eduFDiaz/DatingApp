import { PaginatedResult } from './../_models/pagination';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../_models/User';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUsers(pageNumber?, itemsPerPage?, userParams?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let httpParams = new HttpParams();

    if ( pageNumber != null && itemsPerPage != null) {
      httpParams = httpParams.append('pageNumber', pageNumber);
      httpParams = httpParams.append('pageSize', itemsPerPage);
    }

    if ( userParams != null) {
      httpParams = httpParams.append('minAge', userParams.minAge);
      httpParams = httpParams.append('maxAge', userParams.maxAge);
      httpParams = httpParams.append('gender', userParams.gender);
      httpParams = httpParams.append('orderBy', userParams.orderBy);
    }
    // Now we observe response and not body by default because response will contain pagination and results
    return this.http.get<User[]>(this.baseUrl + 'users/', { observe: 'response', params: httpParams})
    .pipe(
      map( response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id.toString());
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id.toString(), user);
  }

  setAsMainPhoto(userId: number, photoId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + photoId + '/setMain', {});
  }

  DeletePhoto(userId: number, photoId: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + photoId, {});
  }
}
