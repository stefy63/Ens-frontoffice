import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiCalendarService } from 'app/services/api/api-calendar-service';
import { ApiTicketServiceService } from 'app/services/api/api-ticket-service-service';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { keyBy } from 'lodash';
import { Observable, from } from 'rxjs';
import { tap, flatMap, map } from 'rxjs/operators';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public ticketServices;

    constructor(
        private apiCalendarService: ApiCalendarService,
        private apiTicketServiceService: ApiTicketServiceService,
        private storage: LocalStorageService
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
        return;
    }
}
