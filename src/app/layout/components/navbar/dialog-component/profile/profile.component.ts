import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AlertToasterOptions } from 'app/class/alert-toaster-options';
import { ApiItalyGeoService } from 'app/services/api/api-italy-geo.service';
import { AlphabeticOnlyValidator } from 'app/services/MaterialValidator/AlphabeticOnlyValidator';
import { EmailCustomValidator } from 'app/services/MaterialValidator/EmailCustomValidator';
import { NumericOnlyValidator } from 'app/services/MaterialValidator/NumericOnlyValidator';
import { IUserData } from 'app/interfaces/i-userdata';
import { map, assign } from 'lodash';


export const MY_FORMATS = {
  parse: {
      dateInput: 'DD/MM/YYYY',
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'fuse-dialog-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class DialogProfileComponent implements OnInit {

  public options = AlertToasterOptions;
  public modalData: IUserData;
  public formGroup: FormGroup;
  public provinces: any[];
  public gender = [
    { id: 'male', name: 'Maschio'},
    { id: 'female', name: 'Femmina'}
  ];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogProfileComponent>,
    private httpItalyGeo: ApiItalyGeoService
    ) {
      this.httpItalyGeo.apiGetAllProvince()
        .subscribe(provinces => {
          this.provinces = provinces;
        });
  }

  ngOnInit(): void {
    this.modalData = this.data.modalData.userdata as IUserData;
    this.modalData.privacyaccept = this.modalData.privacyaccept || true;
    this.formGroup = new FormGroup({
      'name': new FormControl(this.modalData.name, [
        Validators.required,
        AlphabeticOnlyValidator.alphabeticOnly
      ]),
      'surname': new FormControl(this.modalData.surname, [
        Validators.required,
        AlphabeticOnlyValidator.alphabeticOnly
      ]),
      'email': new FormControl(this.modalData.email, [
        Validators.required, EmailCustomValidator.email_custom
      ]),
      'gender': new FormControl(this.modalData.gender, [Validators.required]),
      'phone': new FormControl(this.modalData.phone, [
        Validators.required, NumericOnlyValidator.numericOnly
      ]),
      'card_number': new FormControl(this.modalData.card_number, []),
      'privacyaccept': new FormControl({value: this.modalData.privacyaccept, disabled: true}),
      'newsletteraccept': new FormControl(this.modalData.newsletteraccept),
      'becontacted': new FormControl(this.modalData.becontacted),
    });
  }

  onYesClick(): void {
    const updatedModalData = assign({}, this.modalData, ...map(this.formGroup.controls, (control, key) => ({[key] : control.value})));
    this.dialogRef.close(updatedModalData);
  }

}
