import { AsyncPipe, NgClass } from '@angular/common';
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
import { Component, EventEmitter, forwardRef, Input, Output, computed, signal, input } from '@angular/core';

import { Xo } from '../../../../../api';
import { XcI18nContextDirective, XcI18nPipe, XcI18nTranslateDirective } from '../../../../../i18n';
import { XcIconButtonComponent } from '../../../../xc-button/xc-icon-button.component';
import { XcPanelComponent } from '../../../../xc-panel/xc-panel.component';
import { XcTooltipDirective } from '../../../../xc-tooltip/xc-tooltip.directive';
import { XcDefinitionProxyComponent } from '../../containers/xc-definition-proxy/xc-definition-proxy.component';
import { XoFormPanelDefinition } from '../../xo/containers.model';

@Component({
    selector: 'xc-form-generic-panel',
    templateUrl: './xc-form-generic-panel.component.html',
    styleUrls: ['./xc-form-generic-panel.component.scss'],
    imports: [XcPanelComponent, NgClass, forwardRef(() => XcDefinitionProxyComponent), XcIconButtonComponent, XcTooltipDirective, AsyncPipe, XcI18nPipe]
})
export class XcFormGenericPanelComponent {

    private readonly definitionState = signal<XoFormPanelDefinition | undefined>(undefined);
    private readonly areaValueState = signal(false);
    readonly toolTip = computed(() => this.areaValueState() ? 'maximize' : 'standard');
    readonly classList = computed(() => {
        const definition = this.definitionState();
        return definition ? definition.style + (definition.compact ? ' compact' : '') : '';
    });

    get areaValue(): boolean {
        return this.areaValueState();
    }

    readonly definitionData = input<Xo[]>(undefined, { alias: "xc-definition-data" });

    @Output()
    readonly closed = new EventEmitter<void>();


    @Input('xc-definition')
    set definition(value: XoFormPanelDefinition) {
        this.definitionState.set(value);
    }

    get definition(): XoFormPanelDefinition | undefined {
        return this.definitionState();
    }


    resize() {
        this.areaValueState.update(value => !value);
    }
}
