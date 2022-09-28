import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MachinesService {
  private endpoint = 'http://localhost:5000/api'

  constructor(private http: HttpClient) {

  }
  ngOnInit() {
  }

  addMachine(machine: any): Observable<any> {
    return this.http.post<any>(this.endpoint + '/machines', machine);
  }

  getMachines(): Observable<any> {
    return this.http.get<any>(this.endpoint + '/machines');
  }

  getMachine(id: string | null): Observable<any> {
    return this.http.get<any>(this.endpoint + '/machines/' + id);
  }

  getLastScanMachine(id: string | null): Observable<any> {
    return this.http.get<any>(this.endpoint + '/scan/' + id);
  }

  scanMachine(id: string | null): Observable<any> {
    return this.http.post<any>(this.endpoint + '/scan/' + id, null);
  }

  removeMachine(id: string | null): Observable<any> {
    return this.http.delete<any>(this.endpoint + '/machines/' + id);
  }

}
