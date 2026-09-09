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
import { ChangeDetectionStrategy, Component, HostBinding, input, linkedSignal, viewChild } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';

import { XcFormBaseComponent } from './xc-form-base.component';


@Component({
    changeDetection: ChangeDetectionStrategy.Eager, 
    template: ''
})
export class XcFormBaseInputComponent extends XcFormBaseComponent {

    private suffixToggled = false;
    private suffixUnfocusedInput = false;

    readonly suffixInput = input<'clear' | 'nullify' | 'password' | 'dropdown'>(undefined, { alias: "xc-form-field-suffix" });

    @HostBinding('attr.suffix')
    readonly suffix = linkedSignal(() => this.suffixInput());

    readonly input = viewChild(MatInput);

    readonly typeInput = input('text');

    readonly type = linkedSignal(() => this.typeInput());

    required = false;

    readonly tabIndexSuffix = input<number>(-1, { alias: "xc-form-field-tab-index-suffix" });

    constructor() {
        super();

        this.required = this.element.nativeElement.hasAttribute('xc-form-validator-required');
    }


    get suffixVisible(): boolean {
        if (this.disabled) {
            return false;
        }
        const suffix = this.suffix();
        if (suffix === 'clear') {
            return !!this.value;
        }
        if (suffix === 'nullify') {
            return this.value != null;
        }
        if (suffix === 'password') {
            return true;
        }
        if (suffix === 'dropdown') {
            return true;
        }
        return false;
    }


    get suffixContent(): string {
        const suffix = this.suffix();
        if (suffix === 'clear') {
            return 'clear';
        }
        if (suffix === 'nullify') {
            return 'clear';
        }
        if (suffix === 'password') {
            return this.suffixToggled ? 'visibility_off' : 'visibility';
        }
        if (suffix === 'dropdown') {
            return 'expand_more';
        }
        return undefined;
    }

    get suffixTooltip(): string {
        return this.iconTooltip || this.i18n.translateSignal(`zeta.xc-form-input.${this.suffixContent}`)();
    }


    protected suffixClickChangedValue(unfocusedInput: boolean) {
        this.input().focus();
    }


    suffixMouseDown(event: MouseEvent) {
        this.suffixUnfocusedInput = this.input().focused;
    }


    suffixClick(event: MouseEvent) {
        event.stopPropagation();
        if (!this.disabled && !this.readonly) {
            this.suffixToggled = !this.suffixToggled;

            const suffix = this.suffix();
            if (suffix === 'clear') {
                this.formControl.setValue('');
            } else if (suffix === 'nullify') {
                this.formControl.setValue(null);
            } else if (suffix === 'password') {
                this.type.set(this.suffixToggled ? 'text' : 'password');
            }
            if (suffix === 'clear' || suffix === 'nullify') {
                this.formControl.markAsDirty();
                this.suffixClickChangedValue(this.suffixUnfocusedInput);
            }
        }
        this.suffixUnfocusedInput = false;
    }


    setFocus() {
        this.input()?.focus();
    }


    addValidator(validator: ValidatorFn) {
        super.addValidator(validator);

        if (validator === Validators.required) {
            this.required = true;
        }
    }
}
