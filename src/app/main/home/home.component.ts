import { Component, OnInit } from '@angular/core';
import { ApiCalendarService } from 'app/services/api/api-calendar-service';
import { ApiTicketServiceService } from 'app/services/api/api-ticket-service-service';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { keyBy } from 'lodash';
import { Observable, from } from 'rxjs';
import { tap, flatMap, map, filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { DialogLogin } from './dialog-component/login/dialog-login.component';
import { ApiLoginService } from 'app/services/api/api-login.service';
import { NotificationsService } from 'angular2-notifications';
import { AlertToasterOptions } from 'app/class/alert-toaster-options';



@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    
    public ticketServices;
    public options = AlertToasterOptions;
    
    constructor(
        public dialog: MatDialog,
        private apiCalendarService: ApiCalendarService,
        private apiTicketServiceService: ApiTicketServiceService,
        private storage: LocalStorageService,
        private apiLoginService: ApiLoginService,
        private toast: NotificationsService
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
            this.openNewTicketModal(service);
        });
    }

    private openNewTicketModal(service: string): void {
        console.log('SERVICE ---> ', service);
        return;
    }
}
