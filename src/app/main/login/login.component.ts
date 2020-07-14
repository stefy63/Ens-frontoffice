import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { get } from 'lodash';
import * as moment from 'moment';
import { GoogleAnalyticsService } from '../../services/analytics/google-analitics-service';
import { SocketService } from '../../services/socket/socket.service';
import { DialogForgotPassword } from '../home/dialog-component/forgot-password/dialog-forgot-password.component';
import { DialogRegistrationComponent } from '../home/dialog-component/registration/regstration.component';
import { AuthService } from './../../services/auth/auth.service';
import { LocalStorageService } from './../../services/local-storage/local-storage.service';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class FuseLoginComponent implements OnInit {

    public formGroup: FormGroup;

  constructor(
    private toast: NotificationsService,
    private storage: LocalStorageService,
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private googleAnalyticsService: GoogleAnalyticsService,
    private socketService: SocketService
  ) {
    if (!!this.storage.getItem('user')) {
        this.router.navigate(['/home']);
    }
    this.formGroup = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });
    }

  ngOnInit() {
    this.googleAnalyticsService.pageEmitter('LoginPage');
  }

  onYesClick(): void {
    this.authService.login({
        username: this.formGroup.get('username').value,
        password: this.formGroup.get('password').value
    }).subscribe(data => {
        this.googleAnalyticsService.eventEmitter('LoginPage', 'Login Successfully');
        this.socketService.sendMessage('welcome-message', {
          userToken: this.authService.getToken().token_session
        });
        this.router.navigate(['home']);
    }, (err) => {
        const errorMessage = get(err, 'error.message', '');
        if (errorMessage === 'USER_NOT_FOUND') {
            this.googleAnalyticsService.eventEmitter('LoginPage', 'Login Fault (user not found)');
            this.toast.error('Errore', 'Utente non trovato!');
        } else if (errorMessage === 'USER_DISABLED') {
            this.googleAnalyticsService.eventEmitter('LoginPage', 'Login Fault (user disabled)');
            this.toast.error('Errore', 'Utente Disabilitato!');
        } else if (errorMessage === 'WRONG_PASSWORD') {
            this.googleAnalyticsService.eventEmitter('LoginPage', 'Login Fault (wrong password)');
            this.toast.error('Errore', 'Password errata!');
        } else {
            this.googleAnalyticsService.eventEmitter('LoginPage', 'Login Fault (generic)');
            this.toast.error('Errore', 'Autenticazione Falita.');
        }
    });
  }

  Registration(): void {
    this.dialog.open(DialogRegistrationComponent);
  }
  Forgot(): void {
    this.dialog.open(DialogForgotPassword);
  }

  public bgSeason() {
        if (this.router.url != '/cookie') {
            const mounth = moment()
            .format('MMMM')
            .toString()
            .toLowerCase();
            return `url("assets/images/backgrounds/${mounth}.jpg") no-repeat`;
        } else {
            return 'unset';
        }
    }


}
