import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MachinesService {
  private endpoint = 'http://localhost:5000/api'

  constructor(private http: HttpClient, private router: Router) {

  }
  ngOnInit() {
  }

  machines(ip: string, username: string, password: string): Observable<any> {
    return this.http.post<any>(this.endpoint + '/machines', { ip, username, password });

  }

}
