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
import { ChangeDetectionStrategy, AfterContentInit, Component, effect, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';

import { XcProgressBarComponent } from '../xc-progress-bar/xc-progress-bar.component';
import { XcButtonBaseComponent } from './xc-button-base.component';


@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'xc-button',
    templateUrl: './xc-button.component.html',
    styleUrls: ['./xc-button-base.component.scss', './xc-button.component.scss'],
    imports: [MatButton, MatRipple, XcProgressBarComponent]
})
export class XcButtonComponent extends XcButtonBaseComponent implements OnInit, AfterContentInit {

    private _translate: boolean;
    private _labelKey = '';

    private element: HTMLElement;

    ngOnInit() {
        super.ngOnInit();
        this.element = this.elementRef.nativeElement.querySelector('.mdc-button__label');
        this._translate = Array.from(this.element.childNodes).some(childNode => childNode.nodeType === Node.TEXT_NODE);
        if (this._translate) {
            this._labelKey = this.element.textContent?.trim() ?? '';
        }
    }

    ngAfterContentInit() {
        super.ngAfterContentInit();
        effect(() => {
            this.localeService.languageSignal();
            queueMicrotask(() => {
                if (this._translate && this.element && this.i18nContext !== undefined && this.i18nContext !== null) {
                    this.element.textContent = this.i18n.translateSignal(this.i18nContext + '.' + this._labelKey)();
                }
            });
        }, { injector: this.injector });
    }
}
