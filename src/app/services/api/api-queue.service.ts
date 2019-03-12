

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GetBaseUrl } from '../../helper/getBaseUrl';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiQueueService {


  private baseUrl = GetBaseUrl.baseUrl();

  constructor(
    private http: HttpClient,
  ) { }

  public apiGetQueueData(id_ticket: number): Observable<any> {
    return this.http.get(this.baseUrl + '/queue/' + id_ticket);
  }

  public apiGetActiveOperator(id_service: number): Observable<any> {
    return this.http.get(this.baseUrl + '/queue/operator/' + id_service);
  }


}
