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

  getLastScanMachine(id : string | null): Observable<any> {
    return this.http.get<any>(this.endpoint + '/scan/' + id);
  }

}
