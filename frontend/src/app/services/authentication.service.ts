import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private endpoint = 'http://localhost:5000/api'

  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient, private router: Router) {
    if (localStorage.getItem('currentUser') != null) {
      this.isUserLoggedIn.next(true);
    } else {
      this.isUserLoggedIn.next(false);
    }
  }

  ngOnInit() {
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.endpoint + '/auth/login', { email, password });
  }

  registerUser(user: any): Observable<any> {
    return this.http.post<any>(this.endpoint + '/users', user);
  }

  logout() {
    if (localStorage.getItem('currentUser') != null) {
      localStorage.removeItem('currentUser')
      this.isUserLoggedIn.next(false);
    }

  }


}