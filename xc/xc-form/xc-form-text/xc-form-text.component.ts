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
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';

import { XcFormComponent } from '../xc-form-base/xc-form-base.component';


@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'xc-form-text',
    templateUrl: './xc-form-text.component.html',
    styleUrls: ['./xc-form-text.component.scss'],
    imports: [MatLabel]
})
export class XcFormTextComponent extends XcFormComponent {

    protected _value: any = '';

    @Input()
    set value(value: any) {
        this._value = value;
    }

    get value(): any {
        if (!this._value) {
            return this._value;
        }
        return this.i18nContext
            ? this.i18n.translateSignal(this.i18nContext + '.' + this._value)()
            : this._value;
    }

    constructor() {
        super();
    }


}
