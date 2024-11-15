import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotificationsService } from 'angular2-notifications';
import { IChangePassword } from 'app/interfaces/i-change-password';
import { ApiUserService } from 'app/services/api/api-user.service';
import { EmptyInputValidator } from 'app/services/MaterialValidator/EmptyInputValidator';
import { PasswordValidator } from 'app/services/MaterialValidator/PasswordValidator';
import { PasswordPolicyValidator } from '../../../../../services/MaterialValidator/PasswordPolicyValidator';
import { GoogleAnalyticsService } from './../../../../../services/analytics/google-analitics-service';

@Component({
  selector: 'fuse-dialog-change-password',
  templateUrl: './dialog-change-password.html',
  styleUrls: ['./dialog-change-password.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogChangePassword implements OnInit {

  public modalData: IChangePassword;
  public formGroup: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogChangePassword>,
    private apiUserService: ApiUserService,
    private toast: NotificationsService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.formGroup = new FormGroup({
      'old_password': new FormControl('', [Validators.required, EmptyInputValidator.whiteSpace]),
      'new_password':  new FormControl('', [Validators.required, EmptyInputValidator.whiteSpace, PasswordPolicyValidator.policy, PasswordValidator.match('confirm_password')]),
      'confirm_password':  new FormControl('', [Validators.required, PasswordValidator.match('new_password')])
    });
  }

  ngOnInit(): void {
    this.googleAnalyticsService.pageEmitter('ChangePasswordPage');
  }

  onYesClick(): void {
    this.apiUserService.apiChangePassword({
        user_id: this.data.modalData.id,
        old_password: this.formGroup.controls['old_password'].value,
        new_password: this.formGroup.controls['new_password'].value,
    } as IChangePassword)
    .subscribe(() => {
        this.toast.success('Cambio Password', 'Password modificata con successo');
        this.dialogRef.close();
    },
    (err) => {
        this.formGroup.controls['old_password'].setValue(null);
        if (err.status === 501) {
            this.toast.error('Cambio Password', 'Vecchia password Errata!');
        } else {
            this.toast.error('Cambio Password', 'Modifica password fallita!');
        }
    });
  }
}
