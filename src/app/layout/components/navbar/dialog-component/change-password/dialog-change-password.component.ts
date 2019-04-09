import { Component, Inject, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { IChangePassword } from 'app/interfaces/i-change-password';
import { EmptyInputValidator } from 'app/services/MaterialValidator/EmptyInputValidator';
import { PasswordValidator } from 'app/services/MaterialValidator/PasswordValidator';
import { ApiUserService } from 'app/services/api/api-user.service';

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
  ) {
    this.formGroup = new FormGroup({
      'old_password': new FormControl('', [Validators.required, EmptyInputValidator.whiteSpace]),
      'new_password':  new FormControl('', [Validators.required, EmptyInputValidator.whiteSpace]),
      'confirm_password':  new FormControl('', [Validators.required, PasswordValidator.match])
    });
  }

  ngOnInit(): void {
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
        console.log(err.error);
        this.formGroup.controls['old_password'].setValue(null);
        if (err.status === 501) {
            this.toast.error('Cambio Password', 'Vecchia password Errata!');
        } else {
            this.toast.error('Cambio Password', 'Modifica password fallita!');
        }
    });
  }
}
