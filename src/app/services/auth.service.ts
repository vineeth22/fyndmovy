import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {
    this.http.get(this.authUrl + '/isLoggedIn').subscribe((response: { isLoggedIn: boolean }) => {
      this.isLoggedIn.next(response.isLoggedIn);
    });
  }

  private authUrl = 'http://localhost:3000/api/auth';
  public isLoggedIn = new BehaviorSubject(false);

  login(user) {
    this.http.post(this.authUrl + '/login', user).subscribe((response: { isLoggedIn: boolean }) => {
      this.isLoggedIn.next(response.isLoggedIn);
    });
  }

  logout() {
    this.http.get(this.authUrl + '/logout').subscribe((response: { isLoggedIn: boolean }) => {
      this.isLoggedIn.next(response.isLoggedIn);
    });
  }
}
