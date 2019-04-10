import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, filter, flatMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';
import { AuthService } from 'app/services/auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogChangePassword } from './dialog-component/change-password/dialog-change-password.component';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { DialogProfileComponent } from './dialog-component/profile/profile.component';
import { ApiUserService } from 'app/services/api/api-user.service';
import { NotificationsService } from 'angular2-notifications';
import { DialogConditionComponent } from './dialog-component/condition/condition.component';
import { DialogPrivacyComponent } from './dialog-component/privacy/privacy.component';
import { IUser } from 'app/interfaces/i-user';

@Component({
    selector     : 'navbar',
    templateUrl  : './navbar.component.html',
    styleUrls    : ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class NavbarComponent implements OnInit, OnDestroy
{
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    public userLogged: boolean;

    // Private
    private _unsubscribeAll: Subject<any>;
    private user: IUser;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private storage: LocalStorageService,
        public dialog: MatDialog,
        private router: Router,
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private authService: AuthService,
        private toast: NotificationsService,
        private apiUserService: ApiUserService
    )
    {
        this.navigation = navigation;
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.user = this.storage.getItem('user');
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                // this.horizontalNavbar = settings.layout.navbar.position === 'top';
                // this.rightNavbar = settings.layout.navbar.position === 'right';
                // this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {'id': this._translateService.currentLang});

        this.authService.change()
            .subscribe(data => {
                this.user = this.storage.getItem('user');
                if (!!data) {
                    this.userLogged = true;
                } else {
                    this.userLogged = false;
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.authService.change().unsubscribe();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    useCondition(): void {
        this.dialog.open(DialogConditionComponent);
    }

    privacy(): void {
        this.dialog.open(DialogPrivacyComponent, {
            width: '80%',
            height: '70%'
        });
    }

    edit_profile(): void{
        this.dialog.open(DialogProfileComponent, {
            hasBackdrop: true,
            data: {
                modalData: this.user
            }
        }).afterClosed().pipe(
                filter((result) => !!result),
                flatMap((result) => {
                    this.user.userdata = result;
                    return this.apiUserService.apiChangeProfile(this.user);
                })
            )
            .subscribe(user => {
                this.storage.setKey('user', user);
                this.toast.success('Aggiornamento Profilo', 'Profilo modificato con successo');
            },
            (err) => {
                this.toast.error('Aggiornamento Profilo', 'Modifica Profilo fallita');
            }
            );
    }

    change_password(): void{
        this.dialog.open(DialogChangePassword, {
            data: {
                modalData: this.user
            }
        });
    }
    
    logout(): void {
        this.authService.logout().subscribe(() => {
            this.router.navigate(['home']);
        });
    }

}
