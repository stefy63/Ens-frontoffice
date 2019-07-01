import { GoogleAnalyticsService } from 'app/services/analytics/google-analitics-service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiForgotPasswordService } from 'app/services/api/api-forgot-password.service';
import { NotificationsService } from 'angular2-notifications';
import { ApiUserService } from 'app/services/api/api-user.service';
import { filter, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['./confirm-registration.component.scss']
})
export class ConfirmRegistrationComponent implements  OnInit {

    public validKey = false;

    private registerKey: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private apiForgotPassword: ApiForgotPasswordService,
    private apiUserService: ApiUserService,
    private toast: NotificationsService,
    private route: Router,
    private googleAnalyticsService: GoogleAnalyticsService
    ) {
        this.registerKey = this.activeRoute.snapshot.paramMap.get('key');
        this.apiForgotPassword.apiForgotPasswordTestKey(this.registerKey)
            .pipe(
                filter(data => !!data),
                mergeMap( () =>
                    this.apiUserService.apiConfirRegistration(this.registerKey)
                )
            )
            .subscribe(data => {
                this.googleAnalyticsService.eventEmitter('ConfirmRegistrationPage', 'Reigistration Successfully');
                this.validKey = true;
                this.toast.success('Benvenuto in Ermes!', 'Sei registrato correttamente.');
                this.route.navigate(['/']);
            });
     }

     ngOnInit() {
        this.googleAnalyticsService.pageEmitter('ConfirmRegistrationPage');
     }

}
