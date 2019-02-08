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
import { IUser } from 'app/interfaces/i-user';
import { DialogProfileComponent } from './dialog-component/profile/profile.component';
import { ApiUserService } from 'app/services/api/api-user.service';
import { NotificationsService } from 'angular2-notifications';

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
        // Set the defaults
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.languages = [
            {
                id   : 'en',
                title: 'English',
                flag : 'us'
            },
            {
                id   : 'tr',
                title: 'Turkish',
                flag : 'tr'
            }
        ];

        this.navigation = navigation;

        // Set the private defaults
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

    /**
     * Search
     *
     * @param value
     */
    search(value): void
    {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void
    {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    useCondition(): void{

    }

    privacy(): void{
        
    }

    edit_profile(): void{

        const dialogRef = this.dialog.open(DialogProfileComponent, {
            // maxWidth: '850px',
            // maxHeight: '600px',
            hasBackdrop: true,
            data: {
                modalData: this.user
            }
        });

        dialogRef
            .afterClosed().pipe(
                filter((result) => !!result),
                flatMap((result) => this.apiUserService.apiChangeProfile(result))
            )
            
            .subscribe(user => {
                this.storage.setItem('data.user', user);
                this.toast.success('Aggiornamento Profilo', 'Profilo modificato con successo');
            },
            (err) => {
                this.toast.error('Aggiornamento Profilo', 'Modifica Profilo fallita');
            }
            );
    }

    change_password(): void{
        const dialogRef = this.dialog.open(DialogChangePassword, {
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
