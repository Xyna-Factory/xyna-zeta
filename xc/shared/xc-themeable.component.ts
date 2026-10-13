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
import { ChangeDetectionStrategy, Component, computed, HostBinding, input, signal } from '@angular/core';


export type XcColor = 'normal' | 'invert' | 'primary' | 'accent' | 'warn' | 'black' | 'white';


@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    template: ''
})
export abstract class XcThemeableComponent {

    protected readonly defaultColor = signal<XcColor>('normal');

    readonly colorInput = input<XcColor | undefined>(
        undefined,
        { alias: 'color' }
    );

    protected readonly color = computed(
        () => this.colorInput() ?? this.defaultColor()
    );

    @HostBinding('attr.color')
    get hostColor(): XcColor {
        return this.color();
    }
}
