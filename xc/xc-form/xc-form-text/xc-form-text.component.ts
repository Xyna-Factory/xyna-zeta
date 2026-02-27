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
import { AfterContentInit, Component, Input } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';

import { ATTRIBUTE_VALUE } from '../../../xc/shared/xc-i18n-attributes';
import { XcFormComponent } from '../xc-form-base/xc-form-base.component';


@Component({
    selector: 'xc-form-text',
    templateUrl: './xc-form-text.component.html',
    styleUrls: ['./xc-form-text.component.scss'],
    imports: [MatLabel]
})
export class XcFormTextComponent extends XcFormComponent implements AfterContentInit {

    protected _value: {key: any, translated: string} = {key: '', translated : ''}

    @Input()
    set value(value: any) {
        this._value.key = value;
        this.translate(ATTRIBUTE_VALUE);
    }

    get value(): any {
        return this._value.translated || this._value.key;
    }

    constructor() {
        super();
    }


    ngAfterContentInit() {
        super.ngAfterContentInit();

        this.subs.push(this.localeService.languageChange.subscribe(() => {
            if (this._value.key) {
                this.translate(ATTRIBUTE_VALUE);
            }
        }));
    }
}
