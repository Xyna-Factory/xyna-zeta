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
import { Component, HostBinding, Input, effect, signal, viewChild } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';

import { XcFormBaseComponent } from './xc-form-base.component';


@Component({
    template: '',
})
export class XcFormBaseInputComponent extends XcFormBaseComponent {

    private readonly suffixToggledState = signal(false);
    private readonly suffixUnfocusedInputState = signal(false);
    private readonly typeState = signal('text');
    private readonly requiredState = signal(false);
    private readonly tabIndexSuffixState = signal<number | undefined>(-1);
    private readonly suffixInputState = signal<'clear' | 'nullify' | 'password' | 'dropdown' | undefined>(undefined);
    private readonly typeInputState = signal('text');
    private readonly tabIndexSuffixInputState = signal<number | undefined>(-1);

    @HostBinding('attr.suffix')
    suffix?: 'clear' | 'nullify' | 'password' | 'dropdown';

    readonly input = viewChild(MatInput);

    @Input('xc-form-field-suffix')
    set suffixInput(value: 'clear' | 'nullify' | 'password' | 'dropdown' | undefined) {
        this.suffixInputState.set(value);
    }

    @Input('type')
    set typeInput(value: string) {
        this.typeInputState.set(value || 'text');
    }

    @Input('xc-form-field-tab-index-suffix')
    set tabIndexSuffixInput(value: number | undefined) {
        this.tabIndexSuffixInputState.set(value);
    }

    get type(): string {
        return this.typeState();
    }

    get required(): boolean {
        return this.requiredState();
    }

    set required(value: boolean) {
        this.requiredState.set(value);
    }

    get tabIndexSuffix(): number | undefined {
        return this.tabIndexSuffixState();
    }

    set tabIndexSuffix(value: number | undefined) {
        this.tabIndexSuffixState.set(value);
    }

    private get suffixUnfocusedInput(): boolean {
        return this.suffixUnfocusedInputState();
    }

    private set suffixUnfocusedInput(value: boolean) {
        this.suffixUnfocusedInputState.set(value);
    }

    constructor() {
        super();

        this.requiredState.set(this.element.nativeElement.hasAttribute('xc-form-validator-required'));
        effect(() => {
            const suffix = this.suffixInputState();
            if (suffix !== undefined) {
                this.suffix = suffix;
            }
            this.typeState.set(this.typeInputState());
            this.tabIndexSuffixState.set(this.tabIndexSuffixInputState());
        });
    }


    get suffixVisible(): boolean {
        if (this.disabled) {
            return false;
        }
        if (this.suffix === 'clear') {
            return !!this.value;
        }
        if (this.suffix === 'nullify') {
            return this.value != null;
        }
        if (this.suffix === 'password') {
            return true;
        }
        if (this.suffix === 'dropdown') {
            return true;
        }
        return false;
    }


    get suffixContent(): string {
        if (this.suffix === 'clear') {
            return 'clear';
        }
        if (this.suffix === 'nullify') {
            return 'clear';
        }
        if (this.suffix === 'password') {
            return this.suffixToggledState() ? 'visibility_off' : 'visibility';
        }
        if (this.suffix === 'dropdown') {
            return 'expand_more';
        }
        return undefined;
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
            this.suffixToggledState.update(value => !value);

            if (this.suffix === 'clear') {
                this.formControl.setValue('', { emitEvent: false });
                this.valueChange.emit('');
            } else if (this.suffix === 'nullify') {
                this.formControl.setValue(null, { emitEvent: false });
                this.valueChange.emit(null);
            } else if (this.suffix === 'password') {
                this.typeState.set(this.suffixToggledState() ? 'text' : 'password');
            }
            if (this.suffix === 'clear' || this.suffix === 'nullify') {
                this.formControl.markAsDirty();
                this.suffixClickChangedValue(this.suffixUnfocusedInput);
            }
        }
        this.suffixUnfocusedInputState.set(false);
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
