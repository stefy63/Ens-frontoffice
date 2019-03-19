import { ITicketHistoryType } from './i-ticket-history-type';
import { ITicket } from './i-ticket';

export class ITicketHistory {

    id?: number;
    id_ticket: number;
    id_type: number;
    action: string;
    date_time?: String;
    readed?: number;
    type?: ITicketHistoryType;
    ticket?: ITicket;
}
