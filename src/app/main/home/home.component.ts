import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { AlertToasterOptions } from 'app/class/alert-toaster-options';
import { HistoryTypes } from 'app/enums/ticket-history-type.enum';
import { TicketServices } from 'app/enums/ticket-services.enum';
import { ServicesColor } from 'app/enums/TicketServicesColor.enum';
import { ITicket } from 'app/interfaces/i-ticket';
import { ITicketHistory } from 'app/interfaces/i-ticket-history';
import { ApiCalendarService } from 'app/services/api/api-calendar-service';
import { ApiLoginService } from 'app/services/api/api-login.service';
import { ApiQueueService } from 'app/services/api/api-queue.service';
import { ApiTicketHistoryService } from 'app/services/api/api-ticket-history.service';
import { ApiTicketServiceService } from 'app/services/api/api-ticket-service-service';
import { ApiTicketService } from 'app/services/api/api-ticket.service';
import { AuthService } from 'app/services/auth/auth.service';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { SocketService } from 'app/services/socket/socket.service';
import { keyBy } from 'lodash';
import { from, Observable } from 'rxjs';
import { filter, flatMap, map, mergeMap, tap } from 'rxjs/operators';
import { DialogLogin } from './dialog-component/login/dialog-login.component';
import { DialogNewTicket } from './dialog-component/new-ticket/dialog-new-ticket.component';
import { DialogRegistrationComponent } from './dialog-component/registration/regstration.component';


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
                mergeMap(() => 
                    this.dialog.open(DialogNewTicket, {
                        data: {
                            service: service,
                            color: ServicesColor[service]
                        }
                    }).afterClosed()
                ),
                filter((dataFromModal) => !!dataFromModal),
                mergeMap((dataFromModal) => this.createTicketAndFirstHistory(dataFromModal, service))
            ).subscribe((ticketHistory: ITicketHistory) => {
                    this.router.navigate(['/waiting', ticketHistory.id_ticket]);
                }, (err) => {
                    console.error(err);
                    this.toast.error('Nuovo Tichet', 'Hai appena richiesto una assistenza, aspetta un minuto prima di richiederne un\'altra');
                });
            }

            private createTicketAndFirstHistory(dataModal, service: string): Observable<ITicketHistory> {
                return this.apiTickeService.create({
                    id_service: TicketServices[service],
                    id_category: dataModal.category,
                    phone: dataModal.phone
                })
                .pipe(
                    mergeMap((fromNewTicket: ITicket) => this.apiTicketHistoryService.create({
                        id_ticket: fromNewTicket.id,
                        id_type: HistoryTypes.INITIAL,
                        action: dataModal.description
                    }))
                );
            }


}
