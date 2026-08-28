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
import { AfterContentChecked, Component, computed, effect, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';

import { XcProgressBarComponent } from '../xc-progress-bar/xc-progress-bar.component';
import { XcButtonBaseComponent } from './xc-button-base.component';


@Component({
    selector: 'xc-button',
    templateUrl: './xc-button.component.html',
    styleUrls: ['./xc-button-base.component.scss', './xc-button.component.scss'],
    imports: [MatButton, MatRipple, XcProgressBarComponent]
})
export class XcButtonComponent extends XcButtonBaseComponent implements OnInit, AfterContentChecked {

    private readonly initializedState = signal(false);
    private readonly labelKeyCapturedState = signal(false);
    private readonly translateState = signal(false);
    private readonly labelKeyState = signal('');
    private readonly labelTranslationKey = computed(() => {
        const key = this.labelKeyState();
        if (!key) {
            return '';
        }

        if (!this.translateState()) {
            return key;
        }

        const context = this.i18nContextState();
        return context ? context + '.' + key : key;
    });
    private readonly labelTranslation = this.i18n.translateSignal(this.labelTranslationKey);

    private element: HTMLElement;

    constructor() {
        super();
        effect(() => {
            if (!this.initializedState() || !this.translateState() || !this.element || !this.labelKeyState()) {
                return;
            }

            const translated = this.labelTranslation() || this.labelKeyState();
            if (translated !== this.element.textContent) {
                this.element.textContent = translated;
            }
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.element = this.elementRef.nativeElement.querySelector('.mdc-button__label');
    }


    ngAfterContentChecked() {
        this.syncLabelFromDom();
    }


    private syncLabelFromDom() {
        if (this.labelKeyCapturedState()) {
            return;
        }
        if (!this.element) {
            return;
        }

        const labelText = (this.element.textContent ?? '').trim();
        if (!labelText) {
            return;
        }

        this.labelKeyState.set(labelText);
        this.translateState.set(labelText.length > 0);
        this.initializedState.set(true);
        this.labelKeyCapturedState.set(true);
    }
}
