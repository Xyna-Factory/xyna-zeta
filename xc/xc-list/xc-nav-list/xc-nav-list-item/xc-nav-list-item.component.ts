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
import { NgClass } from '@angular/common';
import { Component, computed, HostBinding, inject, Input, input, OnInit, output, signal } from '@angular/core';
import { MatListItem } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService, LocaleService } from '@zeta/i18n';

import { coerceBoolean, isBoolean } from '../../../../base';
import { XcDynamicString } from '../../../shared/xc-item';
import { XcThemeableComponent } from '../../../shared/xc-themeable.component';
import { XcIconComponent } from '../../../xc-icon/xc-icon.component';
import { XcTooltipDirective, XcTooltipPosition } from '../../../xc-tooltip/xc-tooltip.directive';
import { xcNavListTranslations_deDE } from '../locale/xc-nav-list-translations.de-DE';
import { xcNavListTranslations_enUS } from '../locale/xc-nav-list-translations.en-US';
import { XcNavListItem, XcNavListOrientation } from '../xc-nav-list.types';


@Component({
    selector: 'xc-nav-list-item',
    templateUrl: './xc-nav-list-item.component.html',
    styleUrls: ['./xc-nav-list-item.component.scss'],
    imports: [MatListItem, NgClass, XcIconComponent, RouterLinkActive, RouterLink, XcTooltipDirective]
})
export class XcNavListItemComponent extends XcThemeableComponent implements OnInit {

    private static _num = 0;
    uniquePanelId = 'xc-nav-list-panel-' + XcNavListItemComponent._num++;

    private readonly itemState = signal<XcNavListItem>(undefined);

    readonly size = input<'small' | 'medium' | 'large' | 'extra-large'>('medium');

    readonly depthInput = input<number>(undefined);

    @HostBinding('attr.depth')
    get depth(): number {
        return this.depthInput();
    }

    @Input({transform: coerceBoolean})
    set shrink(value: boolean) {
        this._shrink = value;
    }
    get shrink(): boolean {
        return this._shrink;
    }
    private _shrink = false;

    readonly orientation = input<XcNavListOrientation>(undefined);

    readonly focusChange = output<XcNavListItem>();


    private readonly i18n = inject<I18nService>(I18nService);
    protected readonly resolveDynamicString = (value: XcDynamicString) => value();
    readonly ariaLabelState = computed(() => {
        const item = this.item;
        return this.i18n.translateSignal('menu_with_elements', { key: '$0', value: (item?.children?.length ?? 0).toString() })();
    });

    constructor() {
        super();
        this.color = 'primary';
        this.i18n.setTranslations(LocaleService.EN_US, xcNavListTranslations_enUS);
        this.i18n.setTranslations(LocaleService.DE_DE, xcNavListTranslations_deDE);
    }


    @Input()
    set item(value: XcNavListItem) {
        this.itemState.set(value);
    }


    get item(): XcNavListItem {
        return this.itemState();
    }


    get ariaLabel(): string {
        return this.ariaLabelState();
    }


    @HostBinding('attr.collapsed')
    get collapsed() {
        return this.item
            ? this.item.collapsed
            : true;
    }


    set collapsed(value: boolean) {
        this.item.collapsed = value;
    }


    ngOnInit() {
        this.collapsed = (this.item && isBoolean(this.item.collapsed))
            ? this.item.collapsed
            : false;
    }


    toggleChildren() {
        this.collapsed = !this.collapsed;
    }


    expandChildren() {
        if (this.collapsed) {
            this.toggleChildren();
        }
    }


    collapseChildren() {
        if (!this.collapsed) {
            this.toggleChildren();
        }
    }


    get tooltipPosition(): XcTooltipPosition {
        switch (this.orientation()) {
            case XcNavListOrientation.TOP: return XcTooltipPosition.bottom;
            case XcNavListOrientation.RIGHT: return XcTooltipPosition.left;
            case XcNavListOrientation.BOTTOM: return XcTooltipPosition.top;
            case XcNavListOrientation.LEFT: return XcTooltipPosition.right;
            default: return undefined;
        }
    }


    getItemClassList(): string[] {
        const list: string[] = [];
        if (this.item.class) {
            list.push(this.item.class);
        }
        if (this.item.disabled) {
            list.push('disabled');
        }
        if (this.item.children && this.item.children.length) {
            list.push('parent');
        }
        return list;
    }
}
