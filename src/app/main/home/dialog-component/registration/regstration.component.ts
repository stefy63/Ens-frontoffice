import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NotificationsService } from 'angular2-notifications';
import { AlertToasterOptions } from 'app/class/alert-toaster-options';
import { User } from 'app/interfaces/i-user-user';
import { GoogleAnalyticsService } from 'app/services/analytics/google-analitics-service';
import { ApiItalyGeoService } from 'app/services/api/api-italy-geo.service';
import { ApiUserService } from 'app/services/api/api-user.service';
import { AlphabeticOnlyValidator } from 'app/services/MaterialValidator/AlphabeticOnlyValidator';
import { EmailCustomValidator } from 'app/services/MaterialValidator/EmailCustomValidator';
import { EmptyInputValidator } from 'app/services/MaterialValidator/EmptyInputValidator';
import { NumericOnlyValidator } from 'app/services/MaterialValidator/NumericOnlyValidator';
import { PasswordValidator } from 'app/services/MaterialValidator/PasswordValidator';
import { assign, get } from 'lodash';
import { PasswordPolicyValidator } from '../../../../services/MaterialValidator/PasswordPolicyValidator';


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
    this.googleAnalyticsService.pageEmitter('RegistrationPage');

    this.formGroup = new FormGroup({
        'username': new FormControl(''),
        'password': new FormControl('', [
            Validators.required,
            EmptyInputValidator.whiteSpace,
            PasswordPolicyValidator.policy,
            PasswordValidator.match('confirm_password')
        ]),
        'confirm_password':  new FormControl('', [
            Validators.required,
            PasswordValidator.match('password')
        ]),
        'userdata': new FormGroup({
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
            'privacyaccept': new FormControl(''),
            'newsletteraccept': new FormControl(''),
            'becontacted': new FormControl(''),
        })
    });
  }

  onYesClick(): void {
    const updatedModalData: User = assign(this.formGroup.value, {noSendMail: false, isOperator: false});
    this.apiUserService.apiCreateUser(updatedModalData)
        .subscribe(data => {
                this.googleAnalyticsService.eventEmitter('RegistrationPage', 'Registration Successfully');
                this.toast.success('Attenzione', 'Ti abbiamo inviato una mail di conferma.');
                this.dialogRef.close();
            }, (err) => {
                const errorMessage = get(err, 'error.message', '');
                if (errorMessage === 'USER_ALREDY_EXIST') {
                    this.googleAnalyticsService.eventEmitter('RegistrationPage', 'Registration Fault (user exist)');
                    this.toast.error('Attenzione', 'Username già presente in archivio');
                } else if (errorMessage === 'EMAIL_ALREDY_EXIST') {
                    this.googleAnalyticsService.eventEmitter('RegistrationPage', 'Registration Fault (email exist)');
                    this.toast.error('Attenzione', 'Email già presente in archivio');
                } else if (errorMessage === 'PHONE_ALREDY_EXIST') {
                  this.toast.error('Attenzione', 'Telefono già presente in archivio');
                }
                else {
                    this.googleAnalyticsService.eventEmitter('RegistrationPage', 'Registration Fault (generic)');
                    this.toast.error('Attenzione', 'Creazione nuovo utente fallita');
                }
            });
    }


}
