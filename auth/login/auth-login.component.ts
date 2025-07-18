/*
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Copyright 2023 Xyna GmbH, Germany
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 */
import { Component, ViewChild } from '@angular/core';

import { environment } from '@environments/environment';

import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, finalize } from 'rxjs/operators';

import { I18nParam, I18nService } from '../../i18n/i18n.service';
import { XcDialogService, XcTabBarComponent, XcTabBarItem } from '../../xc';
import { H5FilterError, H5FilterErrorCodes } from '../auth.interfaces';
import { AuthService } from '../auth.service';
import { CredentialsLoginTabComponent } from '../forms/credentials-login-tab.component';
import { SmartCardLoginTabComponent } from '../forms/smart-card-login-tab.component';
import { WorkflowLoginTabComponent } from '../forms/workflow-login-tab.component';


export interface LoginComponentData {
    username: string;
    password?: string;
    disabled?: boolean;
    onEnter: () => void;
    usernameTabIndex: number;
    usernameSuffixTabIndex: number;
    passwordTabIndex?: number;
    passwordSuffixTabIndex?: number;
}


interface LoginTabItem {
    closable: boolean;
    component: any;
    name: string;
    data: LoginComponentData;
}


@Component({
    selector: 'auth-login',
    templateUrl: './auth-login.component.html',
    styleUrls: ['./auth-login.component.scss'],
    standalone: false
})
export class AuthLoginComponent {

    readonly smartCardTabItem: LoginTabItem = {
        closable: false,
        component: SmartCardLoginTabComponent,
        name: 'SmartCard',
        data: <LoginComponentData>{
            username: '',
            onEnter: this.login.bind(this),
            usernameTabIndex: 1,
            usernameSuffixTabIndex: 4,
        }
    };

    readonly credentialsTabItem: LoginTabItem = {
        closable: false,
        component: CredentialsLoginTabComponent,
        name: 'Credentials',
        data: <LoginComponentData>{
            username: '',
            password: '',
            onEnter: this.login.bind(this),
            usernameTabIndex: 1,
            usernameSuffixTabIndex: 4,
            passwordTabIndex: 2,
            passwordSuffixTabIndex: 5,
        }
    };

    readonly workflowTabItem: LoginTabItem = {
        closable: false,
        component: WorkflowLoginTabComponent,
        name: 'Workflow',
        data: <LoginComponentData>{
            username: '',
            password: '',
            onEnter: this.login.bind(this),
            usernameTabIndex: 1,
            usernameSuffixTabIndex: 4,
            passwordTabIndex: 2,
            passwordSuffixTabIndex: 5,
        }
    };

    @ViewChild(XcTabBarComponent, { static: false })
    tabBar: XcTabBarComponent;

    tabBarSelection = this.smartCardTabItem;
    smartCardDomain = '';

    workflowDomain = '';

    private _pending = false;
    privacyLinkDefined = !!environment.zeta.getPrivacyLink;

    tabBarItems: Array<XcTabBarItem> = [];

    constructor(
        protected readonly authService: AuthService,
        protected readonly dialogService: XcDialogService,
        protected readonly i18n: I18nService
    ) {
        if (this.useTabBar) {
            if (this.useSmartCardLogin) {
                this.tabBarItems.push(this.smartCardTabItem);
            }

            if (this.useCredentialsLogin) {
                this.tabBarItems.push(this.credentialsTabItem);
            }

            if (this.useWorkflowLogin) {
                this.tabBarItems.push(this.workflowTabItem);
            }
        }

        if (this.useSmartCardLogin) {
            this.smartCardInfo();
        } else if (this.useWorkflowLogin) {
            this.workflowInfo();
        }
    }


    get smartCardMethodUsed(): boolean {
        return this.useSmartCardLogin && (this.tabBarSelection === this.smartCardTabItem || (!this.useCredentialsLogin && !this.useWorkflowLogin));
    }

    get credentialsMethodUsed(): boolean {
        return this.useCredentialsLogin && (this.tabBarSelection === this.credentialsTabItem || (!this.useSmartCardLogin && !this.useWorkflowLogin));
    }

    get workflowMethodUsed(): boolean {
        return this.useWorkflowLogin && (this.tabBarSelection === this.workflowTabItem || (!this.useSmartCardLogin && !this.useCredentialsLogin));
    }

    get useSmartCardLogin(): boolean {
        return environment.zeta.auth ? environment.zeta.auth.smartCardLogin : false;
    }

    get useCredentialsLogin(): boolean {
        return environment.zeta.auth ? environment.zeta.auth.credentialsLogin : true;
    }

    get useWorkflowLogin(): boolean {
        return (environment.zeta.auth && environment.zeta.auth.credentialsWorkflowOptions) ? environment.zeta.auth.credentialsWorkflowOptions.credentialsWorkflowLogin : false;
    }

    get useTabBar(): boolean {
        const conditions = [this.useCredentialsLogin, this.useSmartCardLogin, this.useWorkflowLogin];
        return conditions.filter(Boolean).length >= 2;
    }


    login() {
        if (this.smartCardMethodUsed) {
            this.smartCardLogin();
        } else if (this.credentialsMethodUsed) {
            this.credentialsLogin();
        } else if (this.workflowMethodUsed) {
            this.workflowLogin();
        }
    }


    openPrivacyLink() {
        if (this.privacyLinkDefined) {
            window.open(environment.zeta.getPrivacyLink(this.i18n.language), '_blank').focus();
        } else {
            console.log('PrivacyLink is not Defined');
        }
    }


    smartCardInfo() {
        this.authService.fetchSmartCardInfo().pipe(
            filter(info => !!info)
        ).subscribe(info => {
            this.smartCardTabItem.data.username = info.username || '';
            this.smartCardDomain = (info.externaldomains || [])[0] || '';
        });
    }

    workflowInfo() {
        this.workflowDomain = environment.zeta.auth?.credentialsWorkflowOptions?.credentialsWorkflowDomain;
    }


    defaultErrorHandler(): Observable<void> {
        return this.dialogService.info(this.i18n.translate('zeta.auth-login.error'), this.i18n.translate('zeta.auth-login.authentication-failed')).afterDismiss();
    }


    smartCardLogin(force = false) {
        this.pending = true;
        const forcedLogin = force || !!(environment.zeta.auth && environment.zeta.auth.useTheForcedLogin);
        this.authService.smartCardLogin(this.smartCardDomain, forcedLogin).pipe(
            catchError(error => {
                /**
                 * TODO
                 * Check with H5Filter if this error object structure will be used in all projects.
                 * This structure is only an assumption.
                 */
                const filterError = error as H5FilterError;
                if (filterError && filterError.error) {
                    const errorCode = filterError.error.error ? filterError.error.error.errorCode : (filterError.error as any).errorCode;
                    if (errorCode === H5FilterErrorCodes.SESSION_EXISTS) {
                        this.dialogService.confirm(
                            this.i18n.translate('zeta.auth-login.error-header'),
                            this.i18n.translate('zeta.auth-login.error-message', <I18nParam>{ key: '$0', value: this.smartCardTabItem.data.username })
                        ).afterDismissResult(true).subscribe(() =>
                            this.smartCardLogin(true)
                        );
                        return EMPTY;
                    }
                }
                return this.defaultErrorHandler();
            }),
            finalize(() => this.pending = false)
        ).subscribe();
    }


    credentialsLogin(force = false) {
        this.pending = true;
        const forcedLogin = force || !!(environment.zeta.auth && environment.zeta.auth.useTheForcedLogin);
        this.authService.login(this.credentialsTabItem.data.username, this.credentialsTabItem.data.password, forcedLogin).pipe(
            catchError(loginError => {
                // FIXME: Use Error-Datatype (ZETA-6)
                const filterError = loginError as H5FilterError;
                if (filterError && filterError.error) {
                    const errorCode = filterError.error.error ? filterError.error.error.errorCode : (filterError.error as any).errorCode;
                    if (errorCode === H5FilterErrorCodes.SESSION_EXISTS) {
                        this.dialogService.confirm(
                            this.i18n.translate('zeta.auth-login.duplicate-session-header'),
                            this.i18n.translate('zeta.auth-login.duplicate-session-message', <I18nParam>{ key: '$username', value: this.credentialsTabItem.data.username })
                        ).afterDismissResult(true).subscribe(() =>
                            // login again with force
                            this.credentialsLogin(true)
                        );
                        return EMPTY;
                    }
                }
                return this.defaultErrorHandler();
            }),
            finalize(() => this.pending = false)
        ).subscribe();
    }

    workflowLogin(force = false) {
        this.pending = true;
        const forcedLogin = force || !!(environment.zeta.auth && environment.zeta.auth.useTheForcedLogin);
        this.authService.workflowLogin(this.workflowTabItem.data.username, this.workflowTabItem.data.password, this.workflowDomain, forcedLogin).pipe(
            catchError(loginError => {
                // FIXME: Use Error-Datatype (ZETA-6)
                const filterError = loginError as H5FilterError;
                if (filterError && filterError.error) {
                    const errorCode = filterError.error.error ? filterError.error.error.errorCode : (filterError.error as any).errorCode;
                    if (errorCode === H5FilterErrorCodes.SESSION_EXISTS) {
                        this.dialogService.confirm(
                            this.i18n.translate('zeta.auth-login.duplicate-session-header'),
                            this.i18n.translate('zeta.auth-login.duplicate-session-message', <I18nParam>{ key: '$username', value: this.workflowTabItem.data.username })
                        ).afterDismissResult(true).subscribe(() =>
                            // login again with force
                            this.workflowLogin(true)
                        );
                        return EMPTY;
                    }
                }
                return this.defaultErrorHandler();
            }),
            finalize(() => this.pending = false)
        ).subscribe();
    }


    get pending(): boolean {
        return this._pending;
    }


    set pending(value: boolean) {
        this._pending = value;

        this.smartCardTabItem.data.disabled = this.pending;
        this.credentialsTabItem.data.disabled = this.pending;
        this.workflowTabItem.data.disabled = this.pending;
    }
}
