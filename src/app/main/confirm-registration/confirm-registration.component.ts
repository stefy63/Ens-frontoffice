import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiForgotPasswordService } from 'app/services/api/api-forgot-password.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['./confirm-registration.component.scss']
})
export class ConfirmRegistrationComponent {

    public validKey: boolean;

    private registerKey: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private apiForgotPassword: ApiForgotPasswordService,
    private toast: NotificationsService,
    private route: Router
    ) {
        this.registerKey = this.activeRoute.snapshot.paramMap.get('key');
        this.apiForgotPassword.apiForgotPasswordTestKey(this.registerKey)
            .subscribe(data => {
                if (!data) {
                    this.validKey = false;
                } else {
                    this.validKey = true;
                    this.toast.success('Benvenuto in Ermes!', 'Sei registrato correttamente.');
                    this.route.navigate(['/']);
                }
            });
     }

}
