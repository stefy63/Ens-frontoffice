import { Component, Inject} from '@angular/core';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { AuthService } from 'app/services/auth/auth.service';


@Component({
  selector: 'fuse-dialog-login',
  templateUrl: './dialog-login.html',
  styleUrls: ['./dialog-login.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogLogin {

  public formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogLogin>,
    private toast: NotificationsService,
    private authService: AuthService
  ) { 
    this.formGroup = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });
  }

  onYesClick(): void {
    this.authService.login({
        username: this.formGroup.get('username').value,
        password: this.formGroup.get('password').value
    }).subscribe(data => {
        this.dialogRef.close();
    }, (err) => {
        this.toast.error('Errore', 'Autenticazione Falita.');
    });
  }
}
