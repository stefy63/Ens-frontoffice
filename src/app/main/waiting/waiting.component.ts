import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiQueueService } from 'app/services/api/api-queue.service';
import { flatMap, filter, mergeMap } from 'rxjs/operators';
import { merge, of, Subscription } from 'rxjs';
import { SocketService } from 'app/services/socket/socket.service';
import { MatDialog } from '@angular/material';
import { DialogConfirm } from '../dialog-confirm/dialog-confirm.component';
import { ApiTicketService } from 'app/services/api/api-ticket.service';
import { ITicket } from 'app/interfaces/i-ticket';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { ServicesColor } from 'app/enums/TicketServicesColor.enum';
import { find, assign } from 'lodash';
import { NotificationsService } from 'angular2-notifications';
import { TicketStatuses } from 'app/enums/TicketStatuses.enum';
import { TicketServices } from 'app/enums/ticket-services.enum';

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
    private updateQueueSubscription: Subscription;
    private updateTicketSubscription: Subscription;
    private ticketID: number;

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private queueService: ApiQueueService,
        private socket: SocketService,
        private ticketService: ApiTicketService,
        public dialog: MatDialog,
        private storage: LocalStorageService,
        public toast: NotificationsService
    ) {
        this.ticketID = +this.activeRoute.snapshot.paramMap.get('id');
        this.updateTicketSubscription = merge(
            this.ticketService.getFromId(this.ticketID),
            this.socket.getMessage('onTicketUpdated')
        ).pipe(
            filter((ticket) => ticket.id === this.ticketID)
        ).subscribe(ticket => {
            this.newTicket = ticket;
            this.service = find(this.storage.getItem('ticket_service'), ['id', this.newTicket.id_service]).service;
            if (ticket.id_status !== TicketStatuses.ONLINE && ticket.id_status !== TicketStatuses.NEW) {
                this.toast.error('Nuovo Ticket', 'Richiesta non accettata!');
                this.router.navigate(['home']);
            } else if (ticket.id_status === TicketStatuses.ONLINE) {
                if (this.newTicket.id_service === TicketServices.CHAT) {
                    this.router.navigate(['chat', this.ticketID]);
                } else {
                    this.router.navigate(['videochat', this.ticketID]);
                }
            }
        });

        this.updateQueueSubscription = merge(
            this.socket.getMessage('onOperatorSessions'),
            this.socket.getMessage('onTicketInWaiting'),
            of(null)
        ).pipe(
            flatMap(() => {
                return this.queueService.apiGetQueueData(this.ticketID);
            })
        ).subscribe(fromApiQueue => {
            this.ticketInWaiting = fromApiQueue.ticketInWaiting;
            this.operatorOnline = fromApiQueue.operatorActive;
        });
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
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
            data: {
                msg: 'Sei sicuro di voler abbandonare la tua richiesta?'
                }
            })
            .afterClosed()
            .pipe(
                filter((data) => !!data),
                mergeMap(() => {
                    const ticket: ITicket = assign({}, this.newTicket, { id_status: TicketStatuses.ARCHIVED });
                    return this.ticketService.update(ticket);
                })
            ).subscribe(data => {
                this.toast.success('Nuovo Ticket', 'Richiesta Annullata!');
                this.router.navigate(['home']);
            }, err => {
                console.error(err);
                this.toast.error('Nuovo Ticket', 'Richiesta di annullamento non è andata a buon fine!');
            });
    }

}
