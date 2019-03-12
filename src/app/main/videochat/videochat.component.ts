import { Component, OnInit, OnDestroy } from '@angular/core';
import { ITicket } from 'app/interfaces/i-ticket';
import { TicketStatuses } from 'app/enums/TicketStatuses.enum';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { ApiTicketService } from 'app/services/api/api-ticket.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-videochat',
  templateUrl: './videochat.component.html',
  styleUrls: ['./videochat.component.scss']
})
export class VideochatComponent implements OnInit, OnDestroy {
    
    // @Input('ticket') data: Observable<ITicket>;
    public ticket: ITicket;
    private ticketSubscription: Subscription;
    public videochatRunnable = false;
    public showRoom: String = '';
  
    constructor(
      private router: Router,
      private storage: LocalStorageService,
      private toast: NotificationsService,
      private ticketService: ApiTicketService
    ) { }
  
    ngOnInit(): void {
      const newTicket = this.storage.getItem('newTicket');
      this.ticketSubscription = this.ticketService.getFromId(newTicket.id)
        .subscribe((item: ITicket) => {
            this.ticket = item;
            this.videochatRunnable = !_.includes([TicketStatuses.REFUSED, TicketStatuses.CLOSED], this.ticket.id_status);
            window.open('https://appear.in/comunicaens_op' + item.id_operator, '_blank');
            this.router.navigate(['home']);
        }, (err) => {
            console.error(err);
        });

        
    }
  
    ngOnDestroy(): void {
      if (this.ticketSubscription) {
        this.ticketSubscription.unsubscribe();
      }
    }
}
