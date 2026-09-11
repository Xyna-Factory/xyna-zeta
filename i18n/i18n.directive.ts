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
import { Directive, effect, ElementRef, inject, Injector, input, OnInit } from '@angular/core';

import { I18nService } from './i18n.service';
import { LocaleService } from './locale.service';


export abstract class XcI18nBase {

    protected readonly attributeName = 'xc-i18n-context';

    getContext(element: HTMLElement): string {
        if (element) {
            let currentEl = element;

            while (currentEl?.parentElement) {
                const parentEl = currentEl.parentElement;
                const parentAttribute = parentEl.getAttribute(this.attributeName);
                if (parentAttribute) {
                    return parentAttribute;
                }
                currentEl = parentEl;
            }
        }
        return undefined;
    }
}



@Directive({ selector: '[xc-i18n-context]' })
export class XcI18nContextDirective extends XcI18nBase {

    private readonly elementRef = inject(ElementRef<HTMLElement>);

    readonly i18nContext = input<string>('', {
        alias: 'xc-i18n-context'
    });

    constructor() {
        super();

        effect(() => {
            const context = this.i18nContext();
            const generatedContext = this.getContext(this.elementRef.nativeElement);

            this.elementRef.nativeElement.setAttribute(
                this.attributeName,
                generatedContext ? `${generatedContext}.${context}` : context
            );
        });
    }
}



@Directive({ selector: '[xc-i18n]' })
export class XcI18nTranslateDirective extends XcI18nBase implements OnInit {
    private readonly i18n = inject(I18nService);
    private readonly injector = inject(Injector);


    private _context: string;
    private contentKey = '';
    private translatedContent = '';
    readonly element: HTMLElement;

    private readonly localService: LocaleService = inject<LocaleService>(LocaleService);

    constructor() {
        const elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

        super();

        this.element = elementRef.nativeElement;
    }

    ngOnInit() {
        this._context = this.getContext(this.element);
        this.element.setAttribute('xc-i18n', this._context ?? '');

        const isXc = this.element.tagName.startsWith('XC-');

        const cont = this.element.textContent?.trim();

        if (cont && !isXc) {
            effect(() => {
                this.localService.languageSignal();
                if (this.translatedContent !== cont) {
                    this.contentKey = cont;
                }
                const translation = this.i18n.getTranslation(this._context ? this._context + '.' + this.contentKey : this.contentKey);
                this.element.textContent = translation?.value;
                this.translatedContent = translation?.value ?? '';

                if (translation?.pronunciationLanguage) {
                    this.element.setAttribute('lang', translation.pronunciationLanguage);
                }
            }, { injector: this.injector });
        }
    }
}
