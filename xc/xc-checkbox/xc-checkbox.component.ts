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
import { AfterContentInit, ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, model, OnInit, signal } from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatLabel } from '@angular/material/form-field';
import { XcI18nTranslateDirective } from '@zeta/i18n/i18n.directive';

import { coerceBoolean } from '../../base';
import { I18nService } from '../../i18n';
import { XcThemeableComponent } from '../shared/xc-themeable.component';


@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'xc-checkbox',
    templateUrl: './xc-checkbox.component.html',
    styleUrls: ['./xc-checkbox.component.scss'],
    providers: [XcI18nTranslateDirective],
    imports: [MatCheckbox, MatLabel],
    host: {
        '[class.disabled]': 'disabled()',
        '[class.readonly]': 'readonly()'
    }
})
export class XcCheckboxComponent extends XcThemeableComponent implements OnInit, AfterContentInit {
    private readonly elementRef = inject(ElementRef<HTMLElement>);
    protected readonly i18n = inject(I18nService);

    private static uniqueId = 0;
    private readonly _labelRef: string;

    readonly labelInput = input('', {
        alias: 'label'
    });

    readonly checked = model(false);

    readonly disabled = input(false, {
        transform: coerceBoolean
    });

    readonly readonly = input(false, {
        transform: coerceBoolean
    });

    readonly indeterminate = input(false, {
        transform: coerceBoolean
    });

    private readonly _i18nContext = signal('');

    private readonly labelKey = computed(() => {
        const label = this.labelInput();
        const context = this._i18nContext();

        return context && label
            ? `${context}.${label}`
            : label;
    });

    readonly label = this.i18n.translateSignal(this.labelKey);

    constructor() {
        super();

        this._labelRef =
            'xc-checkbox-unique-label-id-' + XcCheckboxComponent.uniqueId++;
    }

    ngAfterContentInit(): void {
        this._i18nContext.set(
            this.elementRef.nativeElement.getAttribute('xc-i18n') ?? ''
        );
    }

    ngOnInit(): void {
        const input =
            this.elementRef.nativeElement.querySelector('input');

        if (input) {
            input.tabIndex = -1;
        }
    }

    get labelRef(): string {
        return this._labelRef;
    }

    change(event: MatCheckboxChange): void {
        this.checked.set(event.checked);
    }
}