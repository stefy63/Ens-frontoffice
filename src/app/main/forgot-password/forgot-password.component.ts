import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {


    private forgotKey: string;

  constructor(
    private activeRoute: ActivatedRoute
    ) {
        this.forgotKey = this.activeRoute.snapshot.paramMap.get('key');
     }

  ngOnInit() {
      console.log(this.forgotKey);
  }

}
