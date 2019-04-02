import { Component, Inject} from '@angular/core';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { ApiForgotPasswordService } from 'app/services/api/api-forgot-password.service';


@Component({
  selector: 'fuse-dialog-forgot-pasword',
  templateUrl: './dialog-forgot-pasword.html',
  styleUrls: ['./dialog-forgot-pasword.scss']
})

export class DialogForgotPassword {

    public formGroup: FormGroup;

    constructor(
    private apiForgotPassword: ApiForgotPasswordService,
    public dialogRef: MatDialogRef<DialogForgotPassword>,
    private toast: NotificationsService,
    ) { 
    this.formGroup = new FormGroup({
        'username': new FormControl('', [Validators.required]),
    });
    }

    onYesClick(): void {
        this.apiForgotPassword.apiForgotPassword({
            username: this.formGroup.get('username').value
        }).subscribe(data => {
            this.toast.success('Attenzione', 'Tiabbiamo inviato una mail');
        }, (err) => {
            if (err.status === 404 && err.error.message === 'USER_OR_EMAIL_NOT_FOUND') {
                this.toast.error('Attenzione', 'Utente non presente in archivio');
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
