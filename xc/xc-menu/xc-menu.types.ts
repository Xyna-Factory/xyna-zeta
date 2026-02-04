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
import { EventEmitter } from '@angular/core';
import { MatMenu, MenuPositionX, MenuPositionY } from '@angular/material/menu';

import { XcItem } from '../shared/xc-item'; // Pfad ggf. anpassen


export interface XcMenuItem extends XcItem {
    children?: XcMenuItem[];              // <--- KORREKTUR: Statt "this[]"
    translate?: boolean;
    click?: (item: XcMenuItem) => void;   // <--- KORREKTUR: Statt "(item: this)"
    visible?: (item: XcMenuItem) => boolean; // <--- KORREKTUR: Statt "(item: this)"
    aside?: string;
    separator?: 'above' | 'below';
}

export type XcMenuXPosition = MenuPositionX;
export type XcMenuYPosition = MenuPositionY;

export type XcMenuOptions = {
    xNexttoTrigger?: boolean;
    yNexttoTrigger?: boolean;
    withArrow?: boolean;
    xOffset?: number;
    yOffset?: number;
    xPosition?: XcMenuXPosition;
    yPosition?: XcMenuYPosition;
};

export function XcMenuOptionsDefault(): XcMenuOptions {
    return {
        xNexttoTrigger: false,
        yNexttoTrigger: false,
        withArrow: false,
        xOffset: 0,
        yOffset: 0,
        xPosition: 'after',
        yPosition: 'below'
    };
}

export interface XcMenu extends MatMenu, XcMenuOptions {
    xPosition: XcMenuXPosition;
    yPosition: XcMenuYPosition;
    overlapTrigger: any;
    templateRef: any;
    close: any;
    focusFirstItem: any;
    resetActiveItem: any;
}

export interface XcMenuComponentInterface {
    menu: XcMenu;
    select: EventEmitter<XcMenuItem>;
}
