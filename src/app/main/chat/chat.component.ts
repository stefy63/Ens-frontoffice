import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewChildren, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Subscription, merge } from 'rxjs';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { NgForm } from '@angular/forms';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { NotificationsService } from 'angular2-notifications';
import { SocketService } from 'app/services/socket/socket.service';
import { TicketStatuses } from 'app/enums/TicketStatuses.enum';
import { TicketServices } from 'app/enums/ticket-services.enum';
import { ChatService } from 'app/services/api/chat-messages.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiTicketService } from 'app/services/api/api-ticket.service';
import { find, orderBy, includes } from 'lodash';
import { ITicket } from 'app/interfaces/i-ticket';
import { ITicketHistory } from 'app/interfaces/i-ticket-history';
import { HistoryTypes } from 'app/enums/ticket-history-type.enum';
import { DialogConfirm } from '../dialog-confirm/dialog-confirm.component';
import { filter, mergeMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { assign } from 'lodash';
import { Router } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {

    public ticket: ITicket;
    public ticketHistorys: ITicketHistory[] = [];
    public activeSpinner = false;
    public pause2scroll = true;
    public opName: number;
    public timer: string;
  
    private isTyping = false;
    private replyInput: any;
    private viewInitFinish = false;
    public showReplyMessage = false;
    private ticketSubscription: Subscription;
    private replyEventSubscription: Subscription;
    private timeoutFunction;
    private timerTimer: any;
    private utcTime: moment.Moment;

  
    @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
    @ViewChildren('replyInput') replyInputField;
    @ViewChild('replyForm') replyForm: NgForm;
    @ViewChild('onWritingMsg') onWritingMsg: ElementRef;
  
    constructor(
      private cd: ChangeDetectorRef,
      private chatService: ChatService,
      private storage: LocalStorageService,
      private toast: NotificationsService,
      private socketService: SocketService,
      private spinner: NgxSpinnerService,
      public dialog: MatDialog,
      private router: Router,
      private ticketService: ApiTicketService
    ) {  }
  
    ngOnInit(): void {
      this.spinner.show();
      const newTicket = this.storage.getItem('newTicket');
      this.ticketSubscription = merge(
          this.ticketService.getFromId(newTicket.id),
          this.socketService.getMessage('onTicketHistoryCreate'),
          this.socketService.getMessage('onTicketUpdated')
        ).subscribe((item: ITicket) => {
                this.ticket = item;
                if (find(item.historys, (history) => history.readed === 0)) {
                    this.chatService.markMessagesReaded(item.id).subscribe();
                }
                this.opName = this.ticket.id_operator;
                this.ticketHistorys = orderBy(this.ticket.historys, 'date_time', 'asc');
                this.spinner.hide();
                this.scrollToBottom();
                this.cd.markForCheck();
                this.showReplyMessage = !includes([TicketStatuses.REFUSED, TicketStatuses.CLOSED, TicketStatuses.ARCHIVED], this.ticket.id_status);
                if (!this.showReplyMessage) {
                    this.toast.info('Servizio Chat', 'Ticket chiuso');
                    clearInterval(this.timerTimer);
                }
            }, (err) => {
            console.log(err);
        });

  
      this.replyEventSubscription = this.socketService.getMessage('onUserWriting').subscribe((data: any) => {
        if (!this.activeSpinner && this.ticket && data.idTicket === this.ticket.id) {
          this.activeSpinner = true;
          setTimeout(() => {
            this.activeSpinner = false;
            this.onWritingMsg.nativeElement.style.display = 'none';
          }, 3000);
          this.onWritingMsg.nativeElement.style.display = 'block';
        }
      });

      this.utcTime = moment.utc(0);
      this.timer = moment.utc(this.utcTime).format('HH:mm:ss');
      this.timerTimer = setInterval(() => {
          this.utcTime = moment.utc(this.utcTime).add(1, 's');
          this.timer = moment.utc(this.utcTime).format('HH:mm:ss');
      }, 1000);
    }
  
    ngOnDestroy(): void {
      if (this.ticketSubscription) {
        this.ticketSubscription.unsubscribe();
      }
      if (this.replyEventSubscription) {
        this.replyEventSubscription.unsubscribe();
      }
    }
  
    ngAfterViewInit(): void {
      this.viewInitFinish = true;
      this.replyInput = this.replyInputField.first.nativeElement;
      this.cd.detectChanges();
      this.resetForm();
      this.scrollToBottom();
      this.onWritingMsg.nativeElement.style.display = 'none';
    }
  
    focusReplyInput(): void {
      this.replyInput.focus();
    }
  
    scrollToBottom(speed?: number): void {
      speed = speed || 2000;
      if (this.viewInitFinish && this.directiveScroll && this.directiveScroll.isInitialized && this.pause2scroll) {
        this.directiveScroll.update();
        this.directiveScroll.scrollToBottom(0, speed);
      }
    }
  
    toglePuseScroll(): void {
      this.pause2scroll = !this.pause2scroll;
      if (this.pause2scroll) {
        this.scrollToBottom();
      }
    }
  
    reply(event): void {
      if (this.replyForm.form.value.message && this.replyForm.form.value.message.trim()) {
        this.sendMessage(this.replyForm.form.value.message.trim(), true);
      } else {
        this.toast.error('Messaggio Vuoto', 'Impossibile spedire messaggi vuoti');
        this.resetForm();
      }
    }
  
    private resetForm(): void {
      if (this.replyForm) {
        this.replyForm.reset();
      }
    }
  
    sendMessage(msgToSend: string, resetForm: boolean): void {
      if (this.ticket) {
        const message: ITicketHistory = {
          id: null,
          id_ticket: this.ticket.id,
          id_type: HistoryTypes.USER,
          action: msgToSend,
          readed: 0
        };
  
        this.spinner.show();
        this.chatService.sendMessage(message).subscribe((data) => {
          this.spinner.hide();
          if (resetForm) {
            this.resetForm();
          }
        });
  
      }
    }
  
    public typing(evt): void {
      if (!this.isTyping && this.ticket.id_service === TicketServices.CHAT) {
        if (this.timeoutFunction) {
          clearTimeout(this.timeoutFunction);
        }
        this.timeoutFunction = setTimeout(() => this.isTyping = false, 3000);
        this.isTyping = true;
        this.socketService.sendMessage('send-to', {
          idTicket: this.ticket.id,
          event: 'onUserWriting',
          obj: {
              idTicket: this.ticket.id
          }
        });
      }
    }
  
    exit(): void {
        this.dialog.open(DialogConfirm, {
            data: {
                msg: 'Sei sicuro di voler chiudere la conversazione?'
                }
            })
            .afterClosed()
            .pipe(
                filter((data) => !!data),
                mergeMap(() => {
                    const ticket: ITicket = assign({}, this.ticket, { id_status: TicketStatuses.ARCHIVED });
                    return this.ticketService.update(ticket);
                })
            ).subscribe(data => {
                this.showReplyMessage = false;
            }, err => {
                console.error(err);
                this.toast.error('Nuovo Ticket', 'Richiesta di annullamento non è andata a buon fine!');
            });
    }

    goHome(): void {
        this.router.navigate(['home']);
    }
}
