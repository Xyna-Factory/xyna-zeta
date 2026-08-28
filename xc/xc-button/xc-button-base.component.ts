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
import { AfterContentInit, Component, computed, ElementRef, HostBinding, HostListener, inject, Input, OnInit, signal, input, viewChild } from '@angular/core';
import { MatRipple } from '@angular/material/core';

import { coerceBoolean } from '../../base';
import { I18nService } from '../../i18n';
import { XcThemeableComponent } from '../shared/xc-themeable.component';


@Component({ 
    template: ''
})
export class XcButtonBaseComponent extends XcThemeableComponent implements OnInit, AfterContentInit {
    protected elementRef = inject(ElementRef);
    protected readonly i18n = inject(I18nService);


    protected readonly ariaLabelKeyState = signal('');
    protected readonly i18nContextState = signal('');
    private readonly ariaLabelTranslationKey = computed(() => {
        const key = this.ariaLabelKeyState();
        if (!key) {
            return '';
        }

        const context = this.i18nContextState();
        return context ? context + '.' + key : key;
    });
    protected readonly ariaLabelTranslation = this.i18n.translateSignal(this.ariaLabelTranslationKey);
    private readonly tabDisabledState = signal(false);
    private readonly disabledState = signal(false);
    private readonly busyState = signal(false);
    private readonly focusInitialState = signal(false);

    readonly type = input('button');

    readonly buttonElementRef = viewChild('button', { read: ElementRef });

    /** material design ripple directive of the button */
    readonly ripple = viewChild(MatRipple);


    i18nContext: string;

    constructor() {
        super();
        const elementRef = this.elementRef;

        (elementRef.nativeElement as HTMLElement).onclick = (event: MouseEvent) => {
            // prevent clicks outside of button dom element
            if (!this.buttonElementRef().nativeElement.contains(event.target)) {
                event.stopPropagation();
            }
        };
    }


    protected setAriaLabel(value: string) {
        this.ariaLabelKeyState.set(value || '');
    }


    ngOnInit() {
        // initially, the setter has to be triggered to get a default value for ariaLabel
        this.setAriaLabel(this.ariaLabel);
    }


    ngAfterContentInit() {
        this.i18nContextState.set(
            this.elementRef.nativeElement.getAttribute('xc-i18n-context')
            ?? this.elementRef.nativeElement.getAttribute('xc-i18n')
            ?? ''
        );
    }


    @Input({transform: coerceBoolean})
    set tabDisabled(value: boolean) {
        this.tabDisabledState.set(value);
    }


    get tabDisabled(): boolean {
        return this.tabDisabledState();
    }


    @HostBinding('class.disabled')
    @Input({transform: coerceBoolean})
    set disabled(value: boolean) {
        this.disabledState.set(value);
    }


    get disabled(): boolean {
        return this.disabledState();
    }


    @HostBinding('class.busy')
    @Input({transform: coerceBoolean})
    set busy(value: boolean) {
        this.busyState.set(value);
    }


    get busy(): boolean {
        return this.busyState();
    }


    get focusInitial(): boolean {
        return this.focusInitialState();
    }


    @Input({alias: 'xc-focus-initial', transform: coerceBoolean})
    set focusInitial(value: boolean) {
        this.focusInitialState.set(value);
    }


    @Input('xc-button-aria-label')
    set ariaLabel(value: string) {
        this.setAriaLabel(value);
    }


    get ariaLabel(): string {
        return this.ariaLabelTranslation();
    }

    readonly tabIndex = input<number>(0, { alias: "xc-button-tab-index" });


    @HostListener('keydown.enter')
    @HostListener('keydown.space')
    launchRipple() {
        this.ripple().launch(0, 0, { centered: true });
    }


    @HostListener('mousedown', ['$event'])
    @HostListener('click', ['$event'])
    prevent(event: Event) {
        // prevents table selection when user clicks on an actionElement (XcIconButton)
        event.stopPropagation();
    }
}
