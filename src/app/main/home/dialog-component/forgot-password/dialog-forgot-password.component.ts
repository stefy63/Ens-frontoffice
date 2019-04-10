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
        'email': new FormControl('', [Validators.required, Validators.email]),
    });
    }

    onYesClick(): void {
        this.apiForgotPassword.apiForgotPassword(this.formGroup.get('email').value)
            .subscribe(data => {
                this.toast.success('Attenzione', 'Tiabbiamo inviato una mail');
            }, (err) => {
                if (err.status === 404 && err.error.message === 'EMAIL_NOT_FOUND') {
                    this.toast.error('Attenzione', 'Email non presente in archivio');
                } else {
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
