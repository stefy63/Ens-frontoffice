import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiCalendarService } from 'app/services/api/api-calendar-service';
import { ApiTicketServiceService } from 'app/services/api/api-ticket-service-service';
import { keyBy, find } from 'lodash';
import { from, forkJoin, of, Subscription, merge, Observable } from 'rxjs';
import { tap, flatMap, map, mergeMap, filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { DialogLogin } from './dialog-component/login/dialog-login.component';
import { ApiLoginService } from 'app/services/api/api-login.service';
import { AlertToasterOptions } from 'app/class/alert-toaster-options';
import { DialogRegistrationComponent } from './dialog-component/registration/regstration.component';
import { AuthService } from 'app/services/auth/auth.service';
import { DialogNewTicket } from './dialog-component/new-ticket/dialog-new-ticket.component';
import { ApiTicketService } from 'app/services/api/api-ticket.service';
import { ApiTicketHistoryService } from 'app/services/api/api-ticket-history.service';
import { ITicketHistoryType } from 'app/interfaces/i-ticket-history-type';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { NotificationsService } from 'angular2-notifications';
import { SocketService } from 'app/services/socket/socket.service';
import { Router } from '@angular/router';
import { ServicesColor } from 'app/enums/TicketServicesColor.enum';
import { HistoryTypes } from 'app/enums/ticket-history-type.enum';
import { ApiQueueService } from 'app/services/api/api-queue.service';
import { TicketServices } from 'app/enums/ticket-services.enum';
import { ITicket } from 'app/interfaces/i-ticket';
import { ITicketHistory } from 'app/interfaces/i-ticket-history';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    

    public ticketServices;
    public options = AlertToasterOptions;
    public userLogged: boolean;

    private dataModal: any;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private apiCalendarService: ApiCalendarService,
        private apiTicketServiceService: ApiTicketServiceService,
        private apiLoginService: ApiLoginService,
        private authService: AuthService,
        private apiTickeService: ApiTicketService,
        private apiTicketHistoryService: ApiTicketHistoryService,
        private storage: LocalStorageService,
        private toast: NotificationsService,
        private socketService: SocketService,
        private apiQueueService: ApiQueueService
    ) { }

    ngOnInit(): void {
        this.apiTicketServiceService.getAll().pipe(
            tap((services) => this.ticketServices = keyBy(services, (serviceItem) => serviceItem.service)),
            flatMap((data) => from(data)),
            flatMap((service: any) => this.apiCalendarService.apiIsActive(service.id).pipe(map((status) => ({
                'service': service.service,
                'status': status
            }))),
            )).subscribe((data) => {
                this.ticketServices[data.service].isOpen = data.status;
            });

        this.authService.change()
            .subscribe(data => {
                if (!!data) {
                    this.userLogged = true;
                } else {
                    this.userLogged = false;
                }
            });
    }

    public isOpen(service: string): boolean {
        return (this.ticketServices) ? this.ticketServices[service].isOpen : false;
    }

    public clickService(service: string): void {
        if (!this.isOpen(service)){
            return;
        }

        this.apiLoginService.apiGetToken().subscribe(data => {
            this.openNewTicketModal(service);
        }, (error) => {
            this.openLoginModal(service);
        });
    }

    private openLoginModal(service: string): void {
        this.dialog.open(DialogLogin)
        .afterClosed()
        .subscribe(data => {
            if (data && data.registration) {
                this.dialog.open(DialogRegistrationComponent);
            } else if (data && data.forgot) {
                // TODO OPEN FORGOT PASSWORD
                this.dialog.open(DialogRegistrationComponent);
            } else {
                this.socketService.sendMessage('welcome-message', {
                    userToken: this.authService.getToken().token_session
                  });
                this.openNewTicketModal(service);
            }
        });
    }

    private openNewTicketModal(service: string): void {
        this.apiQueueService.apiGetActiveOperator(TicketServices[service])
            .pipe(
                tap((data) => {
                    if (data.operatorActive < 1){
                        this.toast.error('Richiesta Nuovo Ticket', 'Nessun Operatore attivo per questo servizio!');
                    }
                }),
                filter((data) => data.operatorActive > 0),
                mergeMap(() => this.dialog.open(DialogNewTicket, {
                        data: {
                            service: service,
                            color: ServicesColor[service]
                        }
                    }).afterClosed()
                ),
                filter((dataFromModal) => !!dataFromModal),
                mergeMap((dataFromModal) => this.createTicketAndFirstHistory(dataFromModal, service))
            ).subscribe((ticketHistory: ITicketHistory) => {
                    this.router.navigate(['waiting']);
                });
            }

            private createTicketAndFirstHistory(dataModal, service: string): Observable<ITicketHistory> {
                            return this.apiTickeService.create({
                                id_service: TicketServices[service],
                                id_category: dataModal.category,
                                phone: dataModal.phone
                        })
                        .pipe(
                            tap((data) => this.storage.setKey('newTicket', data)),
                            mergeMap((fromNewTicket: ITicket) => this.apiTicketHistoryService.create({
                                id_ticket: fromNewTicket.id,
                                id_type: HistoryTypes.INITIAL,
                                action: dataModal.description
                            }))
                        );
              }


}
