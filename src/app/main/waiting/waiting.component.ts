import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiQueueService } from 'app/services/api/api-queue.service';
import { flatMap, tap } from 'rxjs/operators';
import { Observable, merge, of } from 'rxjs';
import { SocketService } from 'app/services/socket/socket.service';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.scss']
})
export class WaitingComponent implements OnInit {

    public ticketInWaiting: number;
    public operatorOnline: number;

    private service: number;
    private color: number;
    private ticketID: number;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private queueService: ApiQueueService,
      private socket: SocketService
  ) { 
    this.route.params.pipe(
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
    
    merge(
        this.socket.getMessage('onTicketInWaiting'), 
        this.socket.getMessage('onOperatorSessions'),
        of(null)
        ).pipe(
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


  setMyStyles(): any {
    const style = {
        color: this.color,
    };
    return style; 
}

}
