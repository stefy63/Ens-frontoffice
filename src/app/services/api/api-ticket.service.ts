import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { GetBaseUrl } from 'app/helper/getBaseUrl';
import { ITicket } from 'app/interfaces/i-ticket';
import { ITicketNew } from 'app/interfaces/i-ticket-new';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiTicketService {


  private baseUrl = GetBaseUrl.baseUrl();

  constructor(
    private http: HttpClient,
  ) { }

  public get(): Observable<ITicket[]> {
    return this.http.get<ITicket[]>(this.baseUrl + '/ticket');
  }

  public getFromId(id: number): Observable<ITicket> {
    return this.http.get<ITicket>(this.baseUrl + '/ticket/' + id);
  }

  public getFromCategory(id: number): Observable<ITicket[]> {
    return this.http.get<ITicket[]>(this.baseUrl + '/ticket?id_category=' + id);
  }

  public getWithCriterias(limit: number, id_status?: number, id_user?: number): Observable<ITicket[]> {
    return this.http.get<ITicket[]>(this.baseUrl + '/ticket', {
      params: Object.assign(
        { mapped: limit.toString() },
        id_status ? { id_status: id_status.toString() } : null,
        id_user ? { id_user: id_user.toString() } : null
      )
    });
  }

  public update(ticket: ITicket): Observable<any> {
    return this.http.put(this.baseUrl + '/ticket/', ticket);
  }

  public create(ticket: ITicketNew): Observable<any> {
    return this.http.post(this.baseUrl + '/ticket/', ticket);
  }

  public getNewedCount(): Observable<number> {
    return this.http.get<number>(this.baseUrl + '/ticket/newedcount/');
  }
}
