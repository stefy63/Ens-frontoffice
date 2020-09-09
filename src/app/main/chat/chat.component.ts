import { GoogleAnalyticsService } from 'app/services/analytics/google-analitics-service';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewChildren, ElementRef, ChangeDetectorRef, HostListener} from '@angular/core';
import { Subscription, merge, interval, Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { NotificationsService } from 'angular2-notifications';
import { SocketService } from 'app/services/socket/socket.service';
import { TicketStatuses } from 'app/enums/TicketStatuses.enum';
import { TicketServices } from 'app/enums/ticket-services.enum';
import { ChatService } from 'app/services/api/chat-messages.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiTicketService } from 'app/services/api/api-ticket.service';
import { orderBy, includes } from 'lodash';
import { ITicket } from 'app/interfaces/i-ticket';
import { ITicketHistory } from 'app/interfaces/i-ticket-history';
import { HistoryTypes } from 'app/enums/ticket-history-type.enum';
import { DialogConfirm } from '../dialog-confirm/dialog-confirm.component';
import { filter, mergeMap, debounceTime, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { assign, filter as filterLodash } from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NgScrollbar } from 'ngx-scrollbar';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {

    public ticket: ITicket;
    public ticketHistorys: ITicketHistory[] = [];
    public activeSpinner = false;
    public opName: number;
    public timer: string;

    private isTyping = false;
    private replyInput: any;
    public showReplyMessage = false;
    private ticketSubscription: Subscription;
    private replyEventSubscription: Subscription;
    private timeoutFunction;
    private timerSubscription: Subscription;
    private utcTime: moment.Moment;
    private keyTimerLocalStore;
    private ticketID: number;
    private updateScrollbar: Subject<void>;
    private updateScrollbarSubscription: Subscription;
    private sysConnected = false;

    @ViewChild(NgScrollbar) directiveScroll: NgScrollbar;
    @ViewChildren('replyInput') replyInputField;
    @ViewChild('replyForm') replyForm: NgForm;
    @ViewChild('onWritingMsg') onWritingMsg: ElementRef;
    @HostListener('window:beforeunload', [])
    // tslint:disable-next-line:typedef
    doSomething() {
        this.sendUserSessionActivity(false);
    }

    constructor(
      private cd: ChangeDetectorRef,
      private chatService: ChatService,
      private storage: LocalStorageService,
      private toast: NotificationsService,
      private socketService: SocketService,
      private spinner: NgxSpinnerService,
      public dialog: MatDialog,
      private router: Router,
      private activeRoute: ActivatedRoute,
      private ticketService: ApiTicketService,
      private googleAnalyticsService: GoogleAnalyticsService
    ) {  }

    ngOnInit(): void {
      this.googleAnalyticsService.pageEmitter('ChatPage');
      this.ticketID = +this.activeRoute.snapshot.paramMap.get('id');
      this.spinner.show();

      this.updateScrollbar = new Subject<void>();
      this.keyTimerLocalStore = `utcChat__${this.ticketID}`;

      this.ticketSubscription = merge(
          this.ticketService.getFromId(this.ticketID),
          this.socketService.getMessage('onTicketHistoryCreate'),
          this.socketService.getMessage('onTicketUpdated')
        )
        .pipe(
            filter(ticket => ticket.id === this.ticketID),
            tap(data => {
                this.ticket = data;
                this.sendUserSessionActivity(true);
            })
        )
        .subscribe((item: ITicket) => {
                this.opName = this.elaborateFakeOperatorId(this.ticket.id_operator);
                this.ticketHistorys = filterLodash(orderBy(this.ticket.historys, 'date_time', 'asc'), (history) => {
                    return history.type.id === HistoryTypes.USER || history.type.id === HistoryTypes.OPERATOR;
                });
                this.spinner.hide();
                this.cd.markForCheck();
                this.updateScrollbar.next();
                this.showReplyMessage = !includes([TicketStatuses.REFUSED, TicketStatuses.CLOSED, TicketStatuses.ARCHIVED], this.ticket.id_status);
                if (!this.showReplyMessage) {
                    this.toast.info('Servizio Chat', 'Ticket chiuso');
                    if (this.timerSubscription) {
                      this.timerSubscription.unsubscribe();
                    }
                    this.storage.setKey(this.keyTimerLocalStore, undefined);
                } else {
                    this.utcTime = this.storage.getItem(this.keyTimerLocalStore) || moment.utc(0);
                    this.timer = moment.utc(this.utcTime).format('HH:mm:ss');
                    if (!this.timerSubscription) {
                        this.timerSubscription = interval(1000).subscribe(() => {
                            this.utcTime = moment.utc(this.utcTime).add(1, 's');
                            this.timer = moment.utc(this.utcTime).format('HH:mm:ss');
                            this.storage.setKey(this.keyTimerLocalStore, this.utcTime);
                        });
                    }
                }
            }, (err) => {
                console.log(err.error);
        });

      this.updateScrollbarSubscription = this.updateScrollbar
      .pipe((
        debounceTime(500)
      ))
      .subscribe(() => {
        setTimeout(() => this.directiveScroll.scrollToBottom(1000), 200);
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
    }

    ngOnDestroy(): void {
      if (this.ticketSubscription) {
        this.ticketSubscription.unsubscribe();
      }
      if (this.replyEventSubscription) {
        this.replyEventSubscription.unsubscribe();
      }
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      if (this.updateScrollbarSubscription) {
        this.updateScrollbarSubscription.unsubscribe();
      }
      this.sendUserSessionActivity(false);
      this.googleAnalyticsService.eventEmitter('ChatPage', 'exit on chat');
    }

    ngAfterViewInit(): void {
      this.replyInput = this.replyInputField.first.nativeElement;
      this.cd.detectChanges();
      this.resetForm();
      this.onWritingMsg.nativeElement.style.display = 'none';
    }

    focusReplyInput(): void {
      this.replyInput.focus();
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
                    this.sendHistorySystem('Ticket chiuso dall\'utente');
                    const ticket: ITicket = assign({}, this.ticket, { id_status: TicketStatuses.CLOSED });
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

    private sendUserSessionActivity(connect: boolean): void {
        if (!this.ticket || this.ticket.id_status !== TicketStatuses.ONLINE) {
            return;
        }

        if (connect && this.sysConnected) {
            return;
        }

        const message = (connect) ? 'Utente collegato' : 'Utente scollegato';
        this.sendHistorySystem(message);
        this.sysConnected = true;
    }

    private sendHistorySystem(msg: string): void {
        const sysHistory = {
            id: null,
            id_type: HistoryTypes.SYSTEM,
            action: msg,
            id_ticket: this.ticketID,
            readed: 0
        };
        this.chatService.sendMessage(sysHistory).subscribe();
    }

    elaborateFakeOperatorId(id_operator): number {
        const date = new Date();
        // tslint:disable-next-line:radix
        return Math.ceil(parseInt('' + date.getDate() + date.getMonth() + '' + date.getFullYear()) * 1000 / parseInt(id_operator)) + date.getMonth() * 10000;
    }
}
