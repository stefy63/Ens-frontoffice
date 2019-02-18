import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GetBaseUrl } from 'app/helper/getBaseUrl';
import { ITicketHistory } from 'app/interfaces/i-ticket-history';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiTicketHistoryService {


  private baseUrl = GetBaseUrl.baseUrl();

  constructor( private http: HttpClient ) { }

  public create(history: ITicketHistory): Observable<any> {
    history.readed = 0;
    return this.http.post(this.baseUrl + '/tickethistory/', history);
  }

  public updateReaded(idTicket: number): Observable<any> {
    return this.http.put(this.baseUrl + '/tickethistory/readed/' + idTicket, null);
  }

  public getUnreadedMessages(): Observable<number> {
    return this.http.get<number>(this.baseUrl + '/tickethistory/unreaded/');
  }

}
