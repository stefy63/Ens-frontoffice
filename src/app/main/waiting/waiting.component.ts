import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiQueueService } from 'app/services/api/api-queue.service';
import { flatMap, tap } from 'rxjs/operators';
import { Observable, merge, of, Subscription } from 'rxjs';
import { SocketService } from 'app/services/socket/socket.service';
import { MatDialog } from '@angular/material';
import { DialogConfirm } from '../dialog-confirm/dialog-confirm.component';
import { ApiTicketService } from 'app/services/api/api-ticket.service';
import { ITicket } from 'app/interfaces/i-ticket';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.scss']
})
export class WaitingComponent implements OnInit, OnDestroy {

    public ticketInWaiting: number;
    public operatorOnline: number;

    private service: number;
    private color: number;
    private ticketID: number;
    private routeParamSubscription: Subscription;
    private updateQueueSubscription: Subscription;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private queueService: ApiQueueService,
      private socket: SocketService,
      private ticketService: ApiTicketService,
      public dialog: MatDialog
  ) { 
    this.routeParamSubscription = this.route.params.pipe(
        tap((fromParams) => {
              if (fromParams) {
                this.ticketID = fromParams.ticketID;
                this.service = fromParams.service;
                this.color = fromParams.color;
            }
            return this.queueService.apiGetQueueData(this.ticketID);
        })
    ).subscribe(fromApiQueue => {
        this.ticketInWaiting = fromApiQueue.ticketInWaiting;
        this.operatorOnline = fromApiQueue.operatorActive;
    });
    
    this.updateQueueSubscription = merge(
        this.socket.getMessage('onTicketInWaiting'), 
        this.socket.getMessage('onOperatorSessions'),
        this.socket.getMessage('onTicketUpdated'),
        of(null)
        )
        .pipe(
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
      this.routeParamSubscription.unsubscribe();
      this.updateQueueSubscription.unsubscribe();
  }

    setMyStyles(): any {
        const style = {
            color: this.color,
        };
        return style; 
    }

    exit(): void {
        const dialogRef = this.dialog.open(DialogConfirm, {
            width: '80%'
          })
          .afterClosed()
          .subscribe(data => {
              if (data) {
                  const ticket: ITicket = {
                      id: this.ticketID,
                      id_status: 4
                  };
                  this.ticketService.update(ticket);
                  this.router.navigate(['home']);
              }
          });
    }

}
