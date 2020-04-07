import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ITicketHistory } from 'app/interfaces/i-ticket-history';
import { ApiTicketHistoryService } from './api-ticket-history.service';

@Injectable()
export class ChatService {

  constructor(private apiTicket: ApiTicketHistoryService)
  {
  }

  public sendMessage(message: ITicketHistory): Observable<ITicketHistory> {
    return this.apiTicket.create(message);
  }

  public markMessagesReaded(idTicket: number): Observable<boolean>  {
    return this.apiTicket.updateReaded(idTicket);
  }
}
