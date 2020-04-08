import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { IForgotChangePassword } from 'app/interfaces/i-forgot-change-password';
import { GoogleAnalyticsService } from 'app/services/analytics/google-analitics-service';
import { ApiForgotPasswordService } from 'app/services/api/api-forgot-password.service';
import { EmptyInputValidator } from 'app/services/MaterialValidator/EmptyInputValidator';
import { PasswordValidator } from 'app/services/MaterialValidator/PasswordValidator';
import { PasswordPolicyValidator } from '../../services/MaterialValidator/PasswordPolicyValidator';

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
    private route: Router,
    private googleAnalyticsService: GoogleAnalyticsService
    ) {
        this.forgotKey = this.activeRoute.snapshot.paramMap.get('key');
        this.apiForgotPassword.apiForgotPasswordTestKey(this.forgotKey)
            .subscribe(data => {
                this.validKey = true;
            });
        
        this.formGroup = new FormGroup({
            'new_password':  new FormControl('', [Validators.required, EmptyInputValidator.whiteSpace, PasswordPolicyValidator.policy, PasswordValidator.match('confirm_password')]),
            'confirm_password':  new FormControl('', [Validators.required, PasswordValidator.match('new_password')])
          });
     }

    ngOnInit() {
    this.googleAnalyticsService.pageEmitter('EndForgotPasswordPage');
    }

    onYesClick(): void {
        this.apiForgotPassword.apiCangePassword(this.forgotKey, {
            new_password: this.formGroup.controls['new_password'].value,
        } as IForgotChangePassword)
        .subscribe(() => {
            this.googleAnalyticsService.eventEmitter('EndForgotPasswordPage', 'New Password Successfully');
            this.toast.success('Ok!', 'Password aggiornata con successo');
            this.route.navigate(['/']);
        },
        (err) => {
            console.log(err.error);
            this.googleAnalyticsService.eventEmitter('EndForgotPasswordPage', 'New Password fault (generic)');
            const errorMessage = err.error === 'USER_OR_EMAIL_NOT_FOUND' ? 'Utente o Email non trovati' : 'Operazione non riuscita';
            this.toast.error('Attenzione', errorMessage);
        });
    }

}
