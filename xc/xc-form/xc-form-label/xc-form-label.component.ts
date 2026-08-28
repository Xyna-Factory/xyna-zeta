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
import { AfterContentInit, Component, computed, effect, ElementRef, inject, signal } from '@angular/core';

import { I18nService } from '../../../i18n';


@Component({
    selector: 'xc-form-label',
    templateUrl: './xc-form-label.component.html',
    styleUrls: ['./xc-form-label.component.scss'], /** @todo reuse xc-form-field.component.scss somehow */
})
export class XcFormLabelComponent implements AfterContentInit {
    private readonly elementRef = inject(ElementRef<HTMLElement>);
    protected readonly i18n = inject(I18nService);
    private readonly initializedState = signal(false);
    private readonly i18nContextState = signal('');
    private readonly textState = signal('');
    private readonly translatedText = computed(() => {
        const text = this.textState();
        if (!text) {
            return text;
        }

        const context = this.i18nContextState();
        return this.i18n.translateSignal(context ? context + '.' + text : text)();
    });

    constructor() {
        effect(() => {
            if (!this.initializedState()) {
                return;
            }
            const translated = this.translatedText();
            if (translated !== this.elementRef.nativeElement.textContent) {
                this.elementRef.nativeElement.textContent = translated;
            }
        });
    }


    ngAfterContentInit() {
        this.i18nContextState.set(
            this.elementRef.nativeElement.getAttribute('xc-i18n-context')
            ?? this.elementRef.nativeElement.getAttribute('xc-i18n')
            ?? ''
        );
        this.textState.set((this.elementRef.nativeElement.textContent ?? '').trim());
        this.initializedState.set(true);
    }
}
