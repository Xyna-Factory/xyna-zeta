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
import { ChangeDetectorRef, Component, forwardRef, inject, Input } from '@angular/core';

import { XoArray } from '@zeta/api';

import { filter, Subscription } from 'rxjs';

import { XcBaseDefinitionComponent } from '../../shared/xc-base-definition/xc-base-definition.component';
import { XoBaseDefinition, XoBaseDefinitionArray } from '../../xo/base-definition.model';
import { XoFormDefinition } from '../../xo/containers.model';
import { XcDefinitionProxyComponent } from '../xc-definition-proxy/xc-definition-proxy.component';

@Component({
    selector: 'xc-form-definition',
    templateUrl: './xc-form-definition.component.html',
    styleUrls: ['./xc-form-definition.component.scss'],
    imports: [forwardRef(() => XcDefinitionProxyComponent)]
})
export class XcFormDefinitionComponent extends XcBaseDefinitionComponent {

    protected readonly cdr: ChangeDetectorRef = inject<ChangeDetectorRef>(ChangeDetectorRef);
    private changeChildrenEventSubscription: Subscription;

    @Input('xc-form-definition')
    set formDefinition(value: XoFormDefinition) {
        this.definition = value;
    }


    get formDefinition(): XoFormDefinition {
        return this.definition as XoFormDefinition;
    }

    protected afterUpdate() {
        super.afterUpdate();
        this.changeChildrenEventSubscription?.unsubscribe();
        if (this.formDefinition.triggerChangeChildren?.eventId) {
            this.changeChildrenEventSubscription = this.eventService.getDefinitionEventPayloadById(this.formDefinition.triggerChangeChildren?.eventId).pipe(filter(
                payload => payload && payload.length > 0
            )).subscribe(
                payload => {
                    if (payload[0] && payload[0] instanceof XoArray) {
                        if (payload[0].data.every(value => value instanceof XoBaseDefinition)) {
                            this.formDefinition.setChildren(payload[0].clone() as XoBaseDefinitionArray);
                        }
                    }
                    if (payload.length > 1) {
                        this.definitionDataUnpacked = payload.slice(1);
                    }
                    this.cdr.markForCheck();
                }
            );
        }
    }
}
