import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private endpoint = 'http://localhost:5000/api'


  constructor(private http: HttpClient, private router: Router) {
    
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
      localStorage.removeItem('emailUser')
    }

  }


}