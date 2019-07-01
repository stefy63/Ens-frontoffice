import { GoogleAnalyticsService } from 'app/services/analytics/google-analitics-service';
import { Component, OnInit } from '@angular/core';
import { get } from 'lodash';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { AuthService } from 'app/services/auth/auth.service';


@Component({
  selector: 'fuse-dialog-login',
  templateUrl: './dialog-login.html',
  styleUrls: ['./dialog-login.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogLogin implements OnInit {

  public formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogLogin>,
    private toast: NotificationsService,
    private authService: AuthService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) { 
    this.formGroup = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });
  }

  ngOnInit(){
    this.googleAnalyticsService.pageEmitter('LoginPage');
  }

  onYesClick(): void {
    this.authService.login({
        username: this.formGroup.get('username').value,
        password: this.formGroup.get('password').value
    }).subscribe(data => {
        this.dialogRef.close(data);
    }, (err) => {
        const errorMessage = get(err, 'error.message', '');
        if (errorMessage === 'USER_NOT_FOUND') {
            this.toast.error('Errore', 'Utente non trovato!');
        } else if (errorMessage === 'USER_DISABLED') {
            this.toast.error('Errore', 'Utente Disabilitato!');
        } else if (errorMessage === 'WRONG_PASSWORD') {
            this.toast.error('Errore', 'Password errata!');
        } else {
            this.toast.error('Errore', 'Autenticazione Falita.');
        }
    });
  }

  Registration(): void {
    this.dialogRef.close({registration: true});
  }
  Forgot(): void {
    this.dialogRef.close({forgot: true});
  }
}
