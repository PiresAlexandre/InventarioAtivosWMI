import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = "http://localhost:5000/api"


  constructor(private http: HttpClient) {

  }

  getProfile(): Observable<any> {
    return this.http.get<any>(this.endpoint + '/auth/profile');
  }

  editProfile(user: any): Observable<any> {
    return this.http.put<any>(this.endpoint + '/auth/profile', user);
  }

  changePassword(formChangePassword: any): Observable<any> {
    return this.http.post<any>(this.endpoint + '/auth/changepassword', formChangePassword);
  }
}
