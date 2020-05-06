import { GoogleAnalyticsService } from 'app/services/analytics/google-analitics-service';
import { Component, Inject, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { ITicketCategory } from 'app/interfaces/i-ticket-category';
import { PhoneValidator } from 'app/services/MaterialValidator/CustomNumericValidator.service';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { assign } from 'lodash';


@Component({
  selector: 'fuse-dialog-new-ticket',
  templateUrl: './dialog-new-ticket.html',
  styleUrls: ['./dialog-new-ticket.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogNewTicket implements OnInit {

  public formGroup: FormGroup;
  public categories: ITicketCategory[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogNewTicket>,
    private storage: LocalStorageService,
    private toast: NotificationsService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.categories = this.storage.getItem('ticket_category');
    this.formGroup = new FormGroup({
        'phone': new FormControl('', [Validators.required, PhoneValidator.validPhone]),
        'category': new FormControl('', [Validators.required]),
        'description': new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
      this.googleAnalyticsService.pageEmitter('NewTicketPage');
  }

  setMyStyles(): any {
      const style = {
          color: this.data.color,
      };
      return style;
  }


  onYesClick(): void {
      if (this.formGroup.valid) {
        const updatedModalData = assign({}, {
            phone: this.formGroup.controls.phone.value,
            category: this.formGroup.controls.category.value,
            description: this.formGroup.controls.description.value,
        });
        this.googleAnalyticsService.eventEmitter('NewTicketPage', 'New Ticket Creation Successfully');
        this.dialogRef.close(updatedModalData);
      }
  }


}
