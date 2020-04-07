import { Component, Inject, OnInit } from '@angular/core';
import { find } from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotificationsService } from 'angular2-notifications';
import { ApiQueueService } from 'app/services/api/api-queue.service';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { ITicketService } from 'app/interfaces/i-ticket-service';
import { SocketService } from 'app/services/socket/socket.service';
import { Subscription } from 'rxjs';
import { GoogleAnalyticsService } from 'app/services/analytics/google-analitics-service';


@Component({
  selector: 'fuse-dialog-queue',
  templateUrl: './dialog-queue.html',
  styleUrls: ['./dialog-queue.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogQueue implements OnInit {

    public ticketInWaiting: number;
    public operatorOnline: number;
    public service: any;

    private ticketService: ITicketService;
    private getTicketInWaitingSubscription: Subscription;
    private getMessageSubscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogQueue>,
    private toast: NotificationsService,
    private queueService: ApiQueueService,
    private storage: LocalStorageService,
    private socket: SocketService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) { 
    this.ticketService = this.storage.getItem('ticket_service');
    this.service = this.data.service;
      
  }


    ngOnInit(): void {
        this.googleAnalyticsService.pageEmitter('WaitingPage');
    }

  setMyStyles(): any {
    const style = {
        color: this.data.color,
    };
    return style; 
}


  onYesClick(): void {
  }

  private setQueueData(): void {
    this.queueService.apiGetQueueData(this.data.ticket.id)
        .subscribe(fromQueueApi => {
            this.ticketInWaiting = fromQueueApi.ticketInWaiting;
            this.operatorOnline = fromQueueApi.operatorActive;
        });
  }
}
