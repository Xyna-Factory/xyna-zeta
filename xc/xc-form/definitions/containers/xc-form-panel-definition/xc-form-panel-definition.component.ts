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
import { Component, Input } from '@angular/core';

import { XoFormPanelDefinition } from '../../xo/containers.model';
import { XcFormDefinitionComponent } from '../xc-form-definition/xc-form-definition.component';
import { Subscription } from 'rxjs';


@Component({
    selector: 'xc-form-panel-definition',
    templateUrl: './xc-form-panel-definition.component.html',
    styleUrls: ['./xc-form-panel-definition.component.scss'],
    standalone: false
})
export class XcFormPanelDefinitionComponent extends XcFormDefinitionComponent {

    private closeEventSubscription: Subscription;

    @Input('xc-panel-definition')
    set panelDefinition(value: XoFormPanelDefinition) {
        this.definition = value;

        this.closeEventSubscription?.unsubscribe();
        if (this.panelDefinition?.closable && this.panelDefinition.triggerClose?.eventId) {
            this.closeEventSubscription = this.eventService.getDefinitionEventPayloadById(this.panelDefinition.triggerClose.eventId).subscribe(
                () => this.closed.emit()
            );
        }
    }


    get panelDefinition(): XoFormPanelDefinition {
        return this.definition as XoFormPanelDefinition;
    }
}
