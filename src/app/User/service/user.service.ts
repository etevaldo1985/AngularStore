import { Log } from './../../models/log';
import { User } from './../../models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/Service/base.service';
import { catchError, map } from 'rxjs/operators';


@Injectable()
export class UserService extends BaseService {

  constructor(private http: HttpClient){super(); }

  public getUsers(): Observable<User[]> {
    return this.http
    .get<User[]>(this.UrlService + 'user')
    .pipe(catchError(this.serviceError));
  }

  public getUserById(id: number): Observable<User> {
    return this.http
    .get<User>(this.UrlService + 'user/' + id)
    .pipe(catchError(this.serviceError));
  }

  public login(user: Log): Observable<Log> {
    const response = this.http
    .post(this.UrlService + 'log', user)
    .pipe(
      map(this.extractData),
      catchError(this.serviceError));

    return response;
  }

  public getLogs(): Observable<Log[]> {
    return this.http
    .get<Log[]>(this.UrlService + 'log')
    .pipe(catchError(this.serviceError));
  }

  public logOut(log: Log): Observable<Log> {
    return this.http
    .put(this.UrlService + 'log/' + log.id, log)
    .pipe(
      map(this.extractData),
      catchError(this.serviceError));

  }

}
