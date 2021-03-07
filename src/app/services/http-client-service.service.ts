import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ENDPOINTS } from './../constants/constants'

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;
  private tokensSubject: BehaviorSubject<any>;
  public tokens: Observable<any>;
  private registeredUserSubject: BehaviorSubject<any>;
  public registeredUser: Observable<any>;
  private userDataSubject: BehaviorSubject<any>;
  public userData: Observable<any>;
  private updatedUserSubject: BehaviorSubject<any>;
  public updatedUser: Observable<any>;
  private refreshTokenTimeout;

  public get userValue() {
    return this.userSubject.value;
  }

  public get tokensValue() {
    return this.tokensSubject.value;
  }

  public get registeredValue() {
    return this.registeredUserSubject.value;
  }

  public get userProfileValue() {
    return this.userDataSubject.value;
  }

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<any>(null);
    this.user = this.userSubject.asObservable();
    this.tokensSubject = new BehaviorSubject<any>(null);
    this.tokens = this.userSubject.asObservable();
    this.registeredUserSubject = new BehaviorSubject<any>(null);
    this.registeredUser = this.userSubject.asObservable();
    this.userDataSubject = new BehaviorSubject<any>(null);
    this.userData = this.userSubject.asObservable();
    this.updatedUserSubject = new BehaviorSubject<any>(null);
    this.updatedUser = this.userSubject.asObservable();
  }

  login(username: string, password: string) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let body = new HttpParams()
      .set('email', username)
      .set('password', password);
    return this.http.post<any>(ENDPOINTS.LOGIN, body.toString(), options)
      .pipe(map(user => {
        const tokens = {
          refreshToken: user.refreshToken,
          token: user.token
        }
        this.userSubject.next(user);
        this.tokensSubject.next(tokens);
        this.startRefreshTokenTimer();
        return user;
      }));
  }

  register(username: string, password: string) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let body = new HttpParams()
      .set('email', username)
      .set('password', password);
    return this.http.post<any>(ENDPOINTS.REGISTER, body.toString(), options)
      .pipe(map(data => {
        this.registeredUserSubject.next(data);
        return data;
      }));
  }

  getUser() {
    return this.http.get<any>(ENDPOINTS.USER)
      .pipe(map(data => {
        this.userDataSubject.next(data);
        return data;
      }));
  }

  updateUser(updateUserForm) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let body = new HttpParams()
      .set('firstname', updateUserForm.firstname)
      .set('lastname', updateUserForm.lastname)
      .set('bio', updateUserForm.bio)
      .set('country', updateUserForm.country)
      .set('email', updateUserForm.email);

    return this.http.put<any>(ENDPOINTS.USER, body.toString(), options)
      .pipe(map(user => {
        this.updatedUserSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      }));
  }

  verify(otp: string, hashToken: string) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let body = new HttpParams()
      .set('otp', otp)
      .set('hashToken', hashToken);
    return this.http.post<any>(ENDPOINTS.VERIFICATION, body.toString(), options)
      .pipe(map(data => {
        this.registeredUserSubject.next(data);
        return data;
      }));
  }

  refreshToken(refreshToken: string, token: string) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let body = new HttpParams()
      .set('refreshToken', refreshToken)
      .set('accessToken', token);
    return this.http.post<any>(ENDPOINTS.REFRESHTOKEN, body.toString(), options)
      .pipe(map(data => {
        this.tokensSubject.next(data);
        this.startRefreshTokenTimer();
        return data;
      }));
  }

  private startRefreshTokenTimer() {
    const jwtToken = JSON.parse(atob(this.userValue.token.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken(this.tokensValue.refreshToken, this.tokensValue.token).subscribe(), timeout);
  }
}
