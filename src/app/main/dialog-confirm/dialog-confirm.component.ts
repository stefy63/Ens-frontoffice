import { Component, Inject, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'fuse-dialog-confirm',
  templateUrl: './dialog-confirm.html',
  styleUrls: ['./dialog-confirm.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogConfirm implements OnInit{
    public msg: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogConfirm>,
  ) {  }

  ngOnInit(): void {
      this.msg = this.data.msg;
  }


  close(result: boolean): void {
      if (result) {
          this.dialogRef.close(result);
      }
  }

}
