import { GoogleAnalyticsService } from 'app/services/analytics/google-analitics-service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketStatuses } from 'app/enums/TicketStatuses.enum';
import { ITicket } from 'app/interfaces/i-ticket';
import { ApiTicketService } from 'app/services/api/api-ticket.service';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-videochat',
  templateUrl: './videochat.component.html',
  styleUrls: ['./videochat.component.scss']
})
export class VideochatComponent implements OnInit, OnDestroy {
    
    public ticket: ITicket;
    private ticketSubscription: Subscription;
    public videochatRunnable = false;
    public showRoom: String = '';
    private ticketID: number;
  
    constructor(
      private router: Router,
      private storage: LocalStorageService,
      private ticketService: ApiTicketService,
      private activeRoute: ActivatedRoute,
      private googleAnalyticsService: GoogleAnalyticsService
    ) { }
  
    ngOnInit(): void {
        this.googleAnalyticsService.pageEmitter('VideoChatPage');
        this.ticketID = +this.activeRoute.snapshot.paramMap.get('id');
        this.ticketSubscription = this.ticketService.getFromId(this.ticketID)
        .subscribe((item: ITicket) => {
            this.ticket = item;
            if (this.ticket.id_status === TicketStatuses.ONLINE){
              const videochatRoomOperator = 'https://appear.in/comunicaens_op' + item.id_operator;
              const windowsOpenStatus = window.open(videochatRoomOperator, '_blank');
              if (windowsOpenStatus == null || typeof(windowsOpenStatus) === 'undefined') {
                  window.location.href = videochatRoomOperator;
              }
            }
            this.router.navigate(['home']);
        }, (err) => {
            console.error(err);
            this.router.navigate(['home']);
        });
    }
  
    ngOnDestroy(): void {
      if (this.ticketSubscription) {
        this.ticketSubscription.unsubscribe();
      }
    }
}
