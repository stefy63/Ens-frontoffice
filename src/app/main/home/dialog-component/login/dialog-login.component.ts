import { Component, Inject, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiLoginService } from 'app/services/api/api-login.service';
import { NotificationsService } from 'angular2-notifications';
import { IDataLogin } from 'app/interfaces/i-data-login';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';


@Component({
  selector: 'fuse-dialog-login',
  templateUrl: './dialog-login.html',
  styleUrls: ['./dialog-login.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogLogin implements OnInit {


  public formGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogLogin>,
    private apiLoginService: ApiLoginService,
    private toast: NotificationsService,
    private storage: LocalStorageService
  ) { 
    this.formGroup = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {}

  onYesClick(): void {
    this.apiLoginService.apiLogin({
        username: this.formGroup.get('username').value,
        password: this.formGroup.get('password').value
    } as IDataLogin)
    .subscribe(data => {
        this.storage.setItem('data', data);
        this.dialogRef.close();
    }, (err) => {
        this.toast.error('Errore', 'Autenticazione Falita.');
    });
  }
}
