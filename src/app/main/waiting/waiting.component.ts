import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiQueueService } from 'app/services/api/api-queue.service';
import { flatMap, filter, tap } from 'rxjs/operators';
import { merge, of, Subscription } from 'rxjs';
import { SocketService } from 'app/services/socket/socket.service';
import { MatDialog } from '@angular/material';
import { DialogConfirm } from '../dialog-confirm/dialog-confirm.component';
import { ApiTicketService } from 'app/services/api/api-ticket.service';
import { ITicket } from 'app/interfaces/i-ticket';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { ServicesColor } from 'app/enums/TicketServicesColor.enum';
import { find } from 'lodash';
import { NotificationsService } from 'angular2-notifications';
import { TicketStatuses } from 'app/enums/TicketStatuses.enum';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.scss']
})
export class WaitingComponent implements OnInit, OnDestroy {

    public ticketInWaiting: number;
    public operatorOnline: number;

    private service: string;
    private newTicket: ITicket;
    private getQueueSubscription: Subscription;
    private updateQueueSubscription: Subscription;
    private updateTicketSubscription: Subscription;

  constructor(
      private router: Router,
      private queueService: ApiQueueService,
      private socket: SocketService,
      private ticketService: ApiTicketService,
      public dialog: MatDialog,
      private storage: LocalStorageService,
      public toast: NotificationsService
  ) { 
    this.newTicket = this.storage.getItem('newTicket');
    this.service = find(this.storage.getItem('ticket_service'), ['id', this.newTicket.id_service]).service;
    this.getQueueSubscription = this.queueService.apiGetQueueData(this.newTicket.id)
    .subscribe(fromApiQueue => {
        this.ticketInWaiting = fromApiQueue.ticketInWaiting;
        this.operatorOnline = fromApiQueue.operatorActive;
    });

    this.updateTicketSubscription = this.socket.getMessage('onTicketUpdated')
            .subscribe(ticket => {
                if (ticket.id === this.newTicket.id && ticket.id_status !== TicketStatuses.ONLINE && ticket.id_status !== TicketStatuses.ARCHIVED) {
                    this.toast.error('Nuovo Ticket', 'Richiesta non accettata!');
                    this.router.navigate(['home']);
                } else if (ticket.id === this.newTicket.id && ticket.id_status === TicketStatuses.ONLINE) {
                    this.router.navigate(['chat']);
                }
            });

    this.updateQueueSubscription = merge(
        this.socket.getMessage('onOperatorSessions'),
        this.socket.getMessage('onTicketInWaiting'),
        of(null)
        )
        .pipe(
            flatMap(() => {
                return this.queueService.apiGetQueueData(this.newTicket.id);
            })
        ).subscribe(fromApiQueue => {
            this.ticketInWaiting = fromApiQueue.ticketInWaiting;
            this.operatorOnline = fromApiQueue.operatorActive;
        });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
      this.getQueueSubscription.unsubscribe();
      this.updateQueueSubscription.unsubscribe();
      this.updateTicketSubscription.unsubscribe();
  }

    setMyStyles(): any {
        const style = {
            color: ServicesColor[this.service],
        };
        return style; 
    }

    exit(): void {
        this.dialog.open(DialogConfirm, {
            width: '80%'
          })
          .afterClosed()
          .subscribe(data => {
              if (data) {
                const ticket: ITicket = {
                    id: this.newTicket.id,
                    id_status: 4,
                    id_service: this.newTicket.id_service
                };
                this.ticketService.update(ticket).subscribe(() => {
                    this.router.navigate(['home']);
                });
                  
              }
          });
    }

}
