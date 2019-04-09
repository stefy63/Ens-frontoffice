import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmptyInputValidator } from 'app/services/MaterialValidator/EmptyInputValidator';
import { PasswordValidator } from 'app/services/MaterialValidator/PasswordValidator';
import { ApiForgotPasswordService } from 'app/services/api/api-forgot-password.service';
import { IForgotChangePassword } from 'app/interfaces/i-forgot-change-password';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

    public formGroup: FormGroup;
    public validKey = false;

    private forgotKey: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private apiForgotPassword: ApiForgotPasswordService,
    private toast: NotificationsService,
    private route: Router
    ) {
        this.forgotKey = this.activeRoute.snapshot.paramMap.get('key');
        this.apiForgotPassword.apiForgotPasswordTestKey(this.forgotKey)
            .subscribe(data => {
                this.validKey = true;
            });
        
        this.formGroup = new FormGroup({
            'new_password':  new FormControl('', [Validators.required, EmptyInputValidator.whiteSpace]),
            'confirm_password':  new FormControl('', [Validators.required, PasswordValidator.match])
          });
     }

  ngOnInit() {
  }

  onYesClick(): void {
    this.apiForgotPassword.apiCangePassword(this.forgotKey, {
        new_password: this.formGroup.controls['new_password'].value,
    } as IForgotChangePassword)
    .subscribe(() => {
        this.toast.success('Ok!', 'Password aggiornata con succeso');
        this.route.navigate(['/']);
    },
    (err) => {
        console.log(err.error);
        this.toast.error('Attenzione', 'Operazione non riuscita');
    });
  }

}
