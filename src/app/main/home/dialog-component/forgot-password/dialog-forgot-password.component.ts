import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { NotificationsService } from 'angular2-notifications';
import { GoogleAnalyticsService } from 'app/services/analytics/google-analitics-service';
import { ApiForgotPasswordService } from 'app/services/api/api-forgot-password.service';


@Component({
  selector: 'fuse-dialog-forgot-pasword',
  templateUrl: './dialog-forgot-pasword.html',
  styleUrls: ['./dialog-forgot-pasword.scss']
})

export class DialogForgotPassword implements OnInit {

    public formGroup: FormGroup;

    constructor(
    private apiForgotPassword: ApiForgotPasswordService,
    public dialogRef: MatDialogRef<DialogForgotPassword>,
    private toast: NotificationsService,
    private googleAnalyticsService: GoogleAnalyticsService
    ) { 
    this.formGroup = new FormGroup({
        'email': new FormControl('', [Validators.required, Validators.email]),
    });
    }

    ngOnInit() {
      this.googleAnalyticsService.pageEmitter('ForgotPasswordPage');
    }

    onYesClick(): void {
        this.apiForgotPassword.apiForgotPassword(this.formGroup.get('email').value)
            .subscribe(data => {
                this.googleAnalyticsService.eventEmitter('ForgotPasswordPage', 'Send Mail successfully');
                this.toast.success('Attenzione', 'Ti abbiamo inviato una mail');
            }, (err) => {
                if (err.status === 404 && err.error.message === 'USER_OR_EMAIL_NOT_FOUND') {
                    this.googleAnalyticsService.eventEmitter('ForgotPasswordPage', 'Send Mail fault (email not found)');
                    this.toast.error('Attenzione', 'Email non presente in archivio');
                } else {
                    this.googleAnalyticsService.eventEmitter('ForgotPasswordPage', 'Send Mail fault (generic)');
                    this.toast.error('Attenzione', 'Errore di sistema');
                }
            });
    }

    goLogin(): void {
    this.dialogRef.close({goLogin: true});
    }

    resendMail(): void {
        this.onYesClick();
    }


}
