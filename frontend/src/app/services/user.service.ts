import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = "http://localhost:5000/api"
  token: any

  httpOptions

  constructor(private http: HttpClient) {
    if (localStorage.getItem('currentUser') != null) {
      let currentUser: any = localStorage.getItem('currentUser')
      let Object = JSON.parse(currentUser);
      this.token = Object.token
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + this.token
        })
      };
    }
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(this.endpoint + '/auth/profile', this.httpOptions);
  }

}
