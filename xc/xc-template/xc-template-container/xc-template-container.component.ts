import { Observable, Subscription } from 'rxjs';

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
import { AsyncPipe } from '@angular/common';
import { Component, inject, InjectionToken, OnDestroy, signal } from '@angular/core';

import { XcDynamicComponent } from '../../shared/xc-dynamic.component';
import { XcPanelComponent } from '../../xc-panel/xc-panel.component';
import { XC_COMPONENT_DATA, XcTemplate } from '../xc-template';
import { XcTemplateComponent } from '../xc-template.component';
import { XoTemplateDefinedBase } from './template-container-base.model';


@Component({
    selector: 'xc-template-container',
    templateUrl: './xc-template-container.component.html',
    styleUrls: ['./xc-template-container.component.scss'],
    imports: [XcPanelComponent, XcTemplateComponent, AsyncPipe]
})
export class XcTemplateContainerComponent extends XcDynamicComponent<XoTemplateDefinedBase> implements OnDestroy {
    readonly childTemplatesVersion = signal(0);


    private readonly subscription: Subscription;

    constructor() {
        super();
        this.subscription = this.injectedData.getTemplate()?.childTemplatesChange().subscribe(() => {
            this.childTemplatesVersion.update(value => value + 1);
        });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    get templates(): Observable<XcTemplate[]> {
        return this.injectedData.getTemplate().getChildTemplates();
    }

    get stylename(): string {
        const template = this.injectedData.getTemplate();
        return template ? template.stylename : '';
    }

    protected getToken(): InjectionToken<string> {
        return XC_COMPONENT_DATA;
    }
}
