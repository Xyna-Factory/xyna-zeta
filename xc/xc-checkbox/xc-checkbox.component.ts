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
import { AfterContentInit, Component, ElementRef, EventEmitter, HostBinding, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { XcI18nTranslateDirective } from '@zeta/i18n/i18n.directive';

import { Subscription } from 'rxjs';

import { coerceBoolean } from '../../base';
import { I18nService, LocaleService } from '../../i18n';
import { ATTRIBUTE_LABEL, KeyTranslationPair } from '../shared/xc-i18n-attributes';
import { XcThemeableComponent } from '../shared/xc-themeable.component';


@Component({
    selector: 'xc-checkbox',
    templateUrl: './xc-checkbox.component.html',
    styleUrls: ['./xc-checkbox.component.scss'],
    providers: [XcI18nTranslateDirective],
    standalone: false
})
export class XcCheckboxComponent extends XcThemeableComponent implements OnInit, AfterContentInit, OnDestroy {

    private static uniqueId = 0;
    private readonly _labelRef: string;

    protected _checked = false;
    protected _indeterminate = false;
    protected _disabled = false;
    protected _readonly = false;
    protected _label: KeyTranslationPair = {key: '', translated: ''};

    protected subs: Subscription[] = [];

    @Input()
    set label(value: string) {
        this._label.key = value;
        this.translate(ATTRIBUTE_LABEL);
    }


    get label(): string {
        return this._label.translated;
    }

    @Output()
    readonly checkedChange = new EventEmitter<boolean>();


    i18nContext: string;

    protected readonly localeService: LocaleService = inject<LocaleService>(LocaleService);

    constructor(private readonly elementRef: ElementRef, protected readonly i18n: I18nService) {
        super();
        this._labelRef = 'xc-checkbox-unique-label-id-' + XcCheckboxComponent.uniqueId++;
    }


    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }


    ngAfterContentInit(): void {
        this.i18nContext = this.elementRef.nativeElement.getAttribute('xc-i18n');
        this.subs.push(this.localeService.languageChange.subscribe(() => {
            if (this._label.key) {
                this.translate(ATTRIBUTE_LABEL);
            }
        }));
    }


    ngOnInit() {
        const input = (this.elementRef.nativeElement as HTMLElement).querySelector('input');
        if (input) {
            input.tabIndex = -1;
        }
    }


    protected translate(attribute: string) {
        if (this.i18nContext !== undefined && this.i18nContext !== null && this[attribute]["key"]) {
            this[attribute]["translated"] = this.i18n.translate(this.i18nContext ? this.i18nContext + '.' + this[attribute]["key"] : this[attribute]["key"]);
        } else {
            this[attribute]["translated"] = this[attribute]["key"];
        }
    }


    get labelRef(): string {
        return this._labelRef;
    }


    @Input()
    set checked(value: boolean) {
        value = coerceBoolean(value);
        if (this._checked !== value) {
            this._checked = value;
        }
    }


    get checked(): boolean {
        return this._checked;
    }


    @Input()
    @HostBinding('class.disabled')
    set disabled(value: boolean) {
        this._disabled = coerceBoolean(value);
    }


    get disabled(): boolean {
        return this._disabled;
    }


    @Input()
    @HostBinding('class.readonly')
    set readonly(value: boolean) {
        this._readonly = coerceBoolean(value);
    }


    get readonly(): boolean {
        return this._readonly;
    }


    @Input()
    set indeterminate(value: boolean) {
        this._indeterminate = coerceBoolean(value);
    }


    get indeterminate(): boolean {
        return this._indeterminate;
    }


    change(event: MatCheckboxChange) {
        this.checked = event.checked;
        this.checkedChange.emit(this.checked);
    }
}
