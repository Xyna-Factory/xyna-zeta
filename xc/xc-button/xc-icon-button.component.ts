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
import { ChangeDetectionStrategy, Component, HostBinding, inject, Input, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';

import { coerceBoolean } from '../../base';
import { I18nService } from '../../i18n/i18n.service';
import { XcIconComponent } from '../xc-icon/xc-icon.component';
import { XcProgressBarComponent } from '../xc-progress-bar/xc-progress-bar.component';
import { XcButtonBaseComponent } from './xc-button-base.component';


@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'xc-icon-button',
    templateUrl: './xc-icon-button.component.html',
    styleUrls: ['./xc-button-base.component.scss', './xc-icon-button.component.scss'],
    imports: [MatIconButton, MatRipple, XcIconComponent, XcProgressBarComponent]
})
export class XcIconButtonComponent extends XcButtonBaseComponent {
    private readonly i18nService = inject(I18nService);


    private _iconMaterial = false;
    private _iconSvg = false;

    readonly iconName = input<string>(undefined, { alias: "xc-icon-name" });

    readonly iconStyle = input<string>(undefined, { alias: "xc-icon-style" });

    readonly iconSize = input<'small' | 'medium' | 'large' | 'extra-large'>('medium', { alias: "xc-icon-size" });

    @HostBinding('attr.size')
    get hostIconSize(): string {
        return this.iconSize();
    }


    protected setAriaLabel(value: string) {
        const iconName = this.iconName();
        super.setAriaLabel(value || (iconName ? this.i18nService.translateInstant(iconName) : ''));
    }


    @Input({alias: 'xc-icon-material', transform: coerceBoolean})
    set iconMaterial(value: boolean) {
        this._iconMaterial = value;
    }


    get iconMaterial(): boolean {
        return this._iconMaterial;
    }


    @Input({alias: 'xc-icon-svg', transform: coerceBoolean})
    set iconSvg(value: boolean) {
        this._iconSvg = value;
    }


    get iconSvg(): boolean {
        return this._iconSvg;
    }
}
