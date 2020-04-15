import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { AlertToasterOptions } from 'app/class/alert-toaster-options';
import { HistoryTypes } from 'app/enums/ticket-history-type.enum';
import { TicketServices } from 'app/enums/ticket-services.enum';
import { ServicesColor } from 'app/enums/TicketServicesColor.enum';
import { ITicket } from 'app/interfaces/i-ticket';
import { ITicketHistory } from 'app/interfaces/i-ticket-history';
import { IUser } from 'app/interfaces/i-user';
import { GoogleAnalyticsService } from 'app/services/analytics/google-analitics-service';
import { ApiCalendarService } from 'app/services/api/api-calendar-service';
import { ApiLoginService } from 'app/services/api/api-login.service';
import { ApiQueueService } from 'app/services/api/api-queue.service';
import { ApiTicketHistoryService } from 'app/services/api/api-ticket-history.service';
import { ApiTicketServiceService } from 'app/services/api/api-ticket-service-service';
import { ApiTicketService } from 'app/services/api/api-ticket.service';
import { ApiUserService } from 'app/services/api/api-user.service';
import { AuthService } from 'app/services/auth/auth.service';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { SocketService } from 'app/services/socket/socket.service';
import { environment } from 'environments/environment.prod';
import { keyBy } from 'lodash';
import * as moment from 'moment';
import { from, Observable } from 'rxjs';
import { filter, flatMap, map, mergeMap, tap } from 'rxjs/operators';
import { DialogProfileComponent } from './../../layout/components/navbar/dialog-component/profile/profile.component';
import { DialogForgotPassword } from './dialog-component/forgot-password/dialog-forgot-password.component';
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
    public userPrivacyAccepted: boolean;

    private dataModal: any;
    private user: IUser;
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
        private apiUserService: ApiUserService,
        private apiQueueService: ApiQueueService,
        public googleAnalyticsService: GoogleAnalyticsService,
        public snackBar: MatSnackBar,
    ) { 
        if (!this.storage.getItem('user')) {
            this.router.navigate(['/login']);
        }
    }

    ngOnInit(): void {
        if (!this.storage.getItem('browser-info')) {
            this.openBrowserInfo();
        }
        this.user = this.storage.getItem('user');
        this.userPrivacyAccepted = !!this.user.userdata.privacyaccept;
        this.googleAnalyticsService.pageEmitter('HomePage');
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
                    this.router.navigate(['login']);
                }
            });
    }

    public isOpen(service: string): boolean {
        return (this.ticketServices) ? this.ticketServices[service].isOpen : false;
    }

    public clickService(service: string): void {
        this.googleAnalyticsService.eventEmitter('ClickCard', service);
        if (!this.isOpen(service)){
            return;
        }

        this.apiLoginService.apiGetToken()
            .subscribe(data => {
                this.openNewTicketModal(service);
            }, (error) => {
                this.openLoginModal(service);
            });
    }

    private openLoginModal(service: string): void {
        this.dialog.open(DialogLogin)
        .afterClosed()
        .subscribe(data => {
            if (data) {
                if (data.registration) {
                    this.dialog.open(DialogRegistrationComponent);
                } else if (data.forgot) {
                    // TODO OPEN FORGOT PASSWORD
                    this.dialog.open(DialogForgotPassword)
                    .afterClosed()
                    .subscribe(fromForgot => {
                        if (!!fromForgot.goLogin) {
                            this.openLoginModal(service);
                        }
                    });
                } else {
                    this.socketService.sendMessage('welcome-message', {
                        userToken: this.authService.getToken().token_session
                    });
                    this.openNewTicketModal(service);
                }
            }
        });
    }

    private openNewTicketModal(service: string): void {
        this.apiQueueService.apiGetActiveOperator(TicketServices[service])
            .pipe(
                tap((data) => {
                    if (data.operatorActive < 1){
                        this.toast.error('Richiesta Nuovo Ticket', 'Non ci sono operatori attivi in questo momento. Riprova più tardi!');
                    }
                }),
                filter((data) => data.operatorActive > 0),
                filter((data) => (TicketServices[service] === TicketServices.CHAT || TicketServices[service] === TicketServices.VIDEOCHAT)),
                mergeMap(() => 
                    this.dialog.open(DialogNewTicket, {
                        hasBackdrop: true,
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

  public bgSeason(): string {
    if (this.router.url !== '/cookie') {
        const mounth = moment()
        .format('MMMM')
        .toString()
        .toLowerCase();
        return `url("assets/images/backgrounds/${mounth}_hd.png");`;
    } else {
        return 'unset';
    }
}


edit_profile(): void{
    this.dialog.open(DialogProfileComponent, {
        hasBackdrop: true,
        data: {
            modalData: this.user
        }
    }).afterClosed().pipe(
            filter((result) => !!result),
            flatMap((result) => {
                this.user.userdata = result;
                return this.apiUserService.apiChangeProfile(this.user);
            })
        )
        .subscribe(user => {
            this.storage.setKey('user', user);
            this.userPrivacyAccepted = !!this.user.userdata.privacyaccept;
            this.toast.success('Aggiornamento Profilo', 'Profilo modificato con successo');
        },
        (err) => {
            this.toast.error('Aggiornamento Profilo', 'Modifica Profilo fallita');
        }
        );
}

logout(): void {
    const externalUrl = environment.return_url;
    this.authService.logout().subscribe(() => {
        window.open(externalUrl, '_self');
    });
}


privacy() {
    this.router.navigate(['privacy']);
}

openBrowserInfo() {
    const snackConfig = new MatSnackBarConfig();
    snackConfig.panelClass = [

    ];
    const snackBarRef = this.snackBar.open(`Browser Supportati:\n
        - Safari >= 11.1.2 (high Sierra)\n
        - Chrome ultima versione (>=80)\n
        - Firefox ultima versione (>=74)\n
    `, 'Ho Capito', {
    duration: 60000,
    panelClass: [
        'multiline-snackbar'
    ],
    verticalPosition: 'top', // 'top' | 'bottom'
    // horizontalPosition: 'end', //'start' | 'center' | 'end' | 'left' | 'right'
    });

    snackBarRef.afterDismissed().subscribe(() => {
        this.storage.setKey('browser-info', true);
    });
}

}
