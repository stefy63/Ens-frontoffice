import { Component, OnInit } from '@angular/core';
import { ApiCalendarService } from 'app/services/api/api-calendar-service';
import { ApiTicketServiceService } from 'app/services/api/api-ticket-service-service';
import { keyBy, find } from 'lodash';
import { from, forkJoin, of } from 'rxjs';
import { tap, flatMap, map, mergeMap } from 'rxjs/operators';
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
import { DialogQueue } from './dialog-component/queue/dialog-queue.component';
import { Router } from '@angular/router';



@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    
    public ticketServices;
    public options = AlertToasterOptions;
    public userLogged: boolean;

    private ticketHistoryType: ITicketHistoryType[];
    
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
        private socketService: SocketService
    ) { }

    ngOnInit(): void {
        this.ticketHistoryType = this.storage.getItem('ticket_history_type');
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
                    userToken: this.authService.getToken().token_session,
                    idUser: data.user.id,
                    status: 'READY',
                    userType: 'USER'
                  });
                this.openNewTicketModal(service);
            }
        });
    }

    private openNewTicketModal(service: string): void {
        this.dialog.open(DialogNewTicket, {
            data: {
                service: service,
                color: (service === 'CHAT') ? ' #CC5B49' : '#365FA5'
            }
        })
        .afterClosed()
        .pipe(
            mergeMap(fromModal => {
                const objService = find(this.ticketServices, ['service', service]);
                const newTicketRequest = {
                    id_service: objService.id,
                    id_category: fromModal.category,
                    phone: fromModal.phone
                };
                return forkJoin(
                    of(fromModal),
                    this.apiTickeService.create(newTicketRequest)
                );
            }),
            mergeMap(([dataModal, fromNewTicket]) => {
                    const actionType = find(this.ticketHistoryType, ['type', 'INITIAL']);
                    const newTicketHistory = {
                        id_ticket: fromNewTicket.id,
                        id_type: actionType.id,
                        action: dataModal.description
                    };
                    return forkJoin(
                        of(fromNewTicket),
                        this.apiTicketHistoryService.create(newTicketHistory)
                );
            })
        )
        .subscribe(([newTicket, newHistory]) => {
            this.router.navigate(['waiting', {
                ticketID: newTicket.id,
                service: service,
                color: (service === 'CHAT') ? ' #CC5B49' : '#365FA5'
            }]);
        });
    }


}
