import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatDialogRef } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AlertToasterOptions } from 'app/class/alert-toaster-options';
import { ApiItalyGeoService } from 'app/services/api/api-italy-geo.service';
import { AlphabeticOnlyValidator } from 'app/services/MaterialValidator/AlphabeticOnlyValidator';
import { EmailCustomValidator } from 'app/services/MaterialValidator/EmailCustomValidator';
import { NumericOnlyValidator } from 'app/services/MaterialValidator/NumericOnlyValidator';
import { assign } from 'lodash';
import { IUser } from 'app/interfaces/i-user';
import { EmptyInputValidator } from 'app/services/MaterialValidator/EmptyInputValidator';
import { ApiUserService } from 'app/services/api/api-user.service';
import { NotificationsService } from 'angular2-notifications';
import { get } from 'lodash';
import { GoogleAnalyticsService } from 'app/services/analytics/google-analitics-service';


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
  selector: 'fuse-dialog-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class DialogRegistrationComponent implements OnInit {

  public options = AlertToasterOptions;
  public user: IUser;
  public formGroup: FormGroup;
  public provinces: any[];
  public gender = [
    { id: 'male', name: 'Maschio'},
    { id: 'female', name: 'Femmina'}
  ];


  constructor(
    public dialogRef: MatDialogRef<DialogRegistrationComponent>,
    public toast: NotificationsService,
    private httpItalyGeo: ApiItalyGeoService,
    private apiUserService: ApiUserService,
    private googleAnalyticsService: GoogleAnalyticsService
    ) {
      this.httpItalyGeo.apiGetAllProvince()
        .subscribe(provinces => {
          this.provinces = provinces;
        });
  }

  ngOnInit(): void {
    this.googleAnalyticsService.pageEmitter('/RegistrationPage');

    this.formGroup = new FormGroup({
        'username': new FormControl(''),
        'password': new FormControl('', [
            Validators.required, 
            EmptyInputValidator.whiteSpace,
            Validators.minLength(5)
        ]),
      'name': new FormControl('', [
        Validators.required,
        AlphabeticOnlyValidator.alphabeticOnly
      ]),
      'surname': new FormControl('', [
        Validators.required,
        AlphabeticOnlyValidator.alphabeticOnly
      ]),
      'email': new FormControl('', [
        Validators.required, 
        EmailCustomValidator.email_custom
      ]),
      'gender': new FormControl('', [
          Validators.required
        ]),
      'phone': new FormControl('', [
        Validators.required, 
        NumericOnlyValidator.numericOnly
      ]),
      'card_number': new FormControl('', []),
      'privacyaccept': new FormControl({value: true, disabled: true}),
      'newsletteraccept': new FormControl(''),
      'becontacted': new FormControl(''),
    });
  }

  onYesClick(): void {
    const updatedModalData = assign(this.user, {
        user: {
            username: this.formGroup.controls.username.value,
            password: this.formGroup.controls.password.value,
        },
        user_data: {
            name: this.formGroup.controls.name.value,
            surname: this.formGroup.controls.surname.value,
            email: this.formGroup.controls.email.value,
            gender: this.formGroup.controls.gender.value,
            phone: this.formGroup.controls.phone.value,
            card_number: this.formGroup.controls.card_number.value,
            privacyaccept: !!this.formGroup.controls.privacyaccept.value,
            newsletteraccept: !!this.formGroup.controls.newsletteraccept.value,
            becontacted: !!this.formGroup.controls.becontacted.value
        }
    });

    this.apiUserService.apiCreateUser(updatedModalData)
        .subscribe(data => {
                this.toast.success('Attenzione', 'Tiabbiamo inviato una mail di conferma.');
                this.dialogRef.close();
            }, (err) => {
                const errorMessage = get(err, 'error.message', '');
                if (errorMessage === 'USER_ALREDY_EXIST') {
                    this.toast.error('Attenzione', 'Utente già presente in archivio');
                } else if (errorMessage === 'EMAIL_ALREDY_EXIST') {
                    this.toast.error('Attenzione', 'Email già presente in archivio');
                }
                else {
                    this.toast.error('Attenzione', 'Creazione nuovo utente fallita');
                }
            });
    }


}
