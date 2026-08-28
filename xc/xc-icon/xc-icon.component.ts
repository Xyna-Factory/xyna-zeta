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
import { AfterContentInit, Component, computed, effect, ElementRef, HostBinding, inject, input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { I18nService } from '@zeta/i18n';

import { coerceBoolean } from '../../base';
import { XcThemeableComponent } from '../shared/xc-themeable.component';


@Component({
    selector: 'xc-icon',
    templateUrl: './xc-icon.component.html',
    styleUrls: ['./xc-icon.component.scss'],
    imports: [MatIcon]
})
export class XcIconComponent extends XcThemeableComponent implements AfterContentInit {
    protected elementRef = inject(ElementRef);
    protected readonly i18n = inject(I18nService);

    private readonly translateState = signal(false);
    private readonly i18nContextState = signal('');
    private readonly projectedLabelState = signal('');
    private readonly projectedLabelTranslation = computed(() => {
        if (!this.translateState()) {
            return this.projectedLabelState();
        }

        const label = this.projectedLabelState();
        if (!label) {
            return '';
        }

        const context = this.i18nContextState();
        const key = context ? context + '.' + label : label;
        return this.i18n.translateSignal(key)();
    });

    readonly iconSizeInput = input<'small' | 'medium' | 'large' | 'extra-large'>('medium', { alias: 'xc-icon-size' });
    readonly reverseDirectionInput = input(false, { alias: 'xc-icon-reverse-direction', transform: coerceBoolean });
    readonly iconMaterialInput = input(false, { alias: 'xc-icon-material', transform: coerceBoolean });
    readonly iconSvgInput = input(false, { alias: 'xc-icon-svg', transform: coerceBoolean });
    readonly iconStyleInput = input('', { alias: 'xc-icon-style' });
    readonly iconNameInput = input('', { alias: 'xc-icon-name' });

    constructor() {
        super();
        effect(() => {
            if (!this.translateState()) {
                return;
            }

            const el = this.elementRef.nativeElement.querySelector('span');
            if (!el) {
                return;
            }

            const translated = this.projectedLabelTranslation();
            if (el.textContent !== translated) {
                el.textContent = translated;
            }
        });
    }

    @HostBinding('attr.size')
    get iconSize(): 'small' | 'medium' | 'large' | 'extra-large' {
        return this.iconSizeInput();
    }


    @HostBinding('class.reverse-direction')
    get reverseDirection(): boolean {
        return this.reverseDirectionInput();
    }


    get iconMaterial(): boolean {
        return this.iconMaterialInput();
    }


    get iconSvg(): boolean {
        return this.iconSvgInput();
    }


    get iconStyle(): string {
        return this.iconStyleInput() || 'xds';
    }


    @HostBinding('attr.name')
    get iconName(): string {
        return this.iconNameInput();
    }

    get iconClass(): string {
        return ['icon', this.iconStyle, this.iconName].join('-');
    }


    ngAfterContentInit() {
        const el = this.elementRef.nativeElement.querySelector('span');
        const projectedLabel = (el?.textContent ?? '').trim();
        this.i18nContextState.set(
            this.elementRef.nativeElement.getAttribute('xc-i18n-context')
            ?? this.elementRef.nativeElement.getAttribute('xc-i18n')
            ?? ''
        );
        this.projectedLabelState.set(projectedLabel);
        this.translateState.set(projectedLabel.length > 0);
    }
}


export enum XDSIconName {
    ACCORDION = 'accordion',
    ADD = 'add',
    ARROWDOWN = 'arrowdown',
    ARROWLEFT = 'arrowleft',
    ARROWRIGHT = 'arrowright',
    ARROWUP = 'arrowup',
    CALENDAR = 'calendar',
    CHECKED = 'checked',
    CLOSE = 'close',
    COPY = 'copy',
    DELETE = 'delete',
    EDIT = 'edit',
    EXTERNAL = 'external',
    FILE = 'file',
    FILEEXPORT = 'fileexport',
    FILEIMPORT = 'fileimport',
    FILTER = 'filter',
    FILTERCLEAR = 'filterclear',
    FULLSCREEN = 'fullscreen',
    HELP = 'help',
    INFO = 'info',
    LOADINGSPINNER = 'loadingspinner',
    MAXIMIZE = 'maximize',
    MENU = 'menu',
    MESSAGE = 'message',
    MINIMIZE = 'minimize',
    MSGALARM = 'msgalarm',
    MSGINFO = 'msginfo',
    MSGMESSAGE = 'msgmessage',
    MSGREADY = 'msgready',
    MSGWARNING = 'msgwarning',
    PASTE = 'paste',
    PORT = 'port',
    PRINT = 'print',
    RELOAD = 'reload',
    SEARCH = 'search',
    SETTINGS = 'settings',
    SUBNAVEXPAND = 'subnavexpand',
    TIME = 'time',
    USER = 'user'
}
