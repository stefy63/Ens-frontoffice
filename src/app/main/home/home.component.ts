import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiCalendarService } from 'app/services/api/api-calendar-service';
import { ApiTicketServiceService } from 'app/services/api/api-ticket-service-service';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { tap, map, flatMap } from 'rxjs/operators';
import { Observable, from } from 'rxjs';


@Component({
    selector   : 'home',
    templateUrl: './home.component.html',
    styleUrls  : ['./home.component.scss']
})
export class HomeComponent implements OnInit
{
    public ticketService;

    constructor(
        private apiCalendarService: ApiCalendarService,
        private apiTicketServiceService: ApiTicketServiceService,
        private storage: LocalStorageService
    )
    { }

    ngOnInit(): void {
        this.getService().then(data => {
            console.log(data);
            this.storage.setItem('ticketService', data);
            this.ticketService = data;
        });
    }



    public isOpen(service: string): boolean {
        if (this.ticketService) {
            const find = this.ticketService.find( val => val.service === service);
            return find.isOpen;
        }
        return false;        
    }

    public clickService(service: string): void {
        return;
    }

    private async getService(): Promise<any> {
        const ret =  this.apiTicketServiceService.getAll().toPromise()
            .then(res => res.forEach(async e => {
                console.log(e);
                e.isOpen = await this.apiCalendarService.apiIsActive(e.id).toPromise();
            })
        );
        return ret;
    }

}
