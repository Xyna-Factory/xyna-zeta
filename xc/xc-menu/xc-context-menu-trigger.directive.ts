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
import { take } from 'rxjs';

import { Directive, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';

import { XcContextMenuService } from './xc-context-menu.service';
import { XcMenuService } from './xc-menu.service';
import { XcMenuItem } from './xc-menu.types';


@Directive({
    selector: '[xc-context-menu-trigger]'
})
export class XcContextMenuTriggerDirective {
    private readonly menuService = inject(XcMenuService);
    private readonly contextMenuService = inject(XcContextMenuService);

    @Input('xc-context-menu-items')
    contextMenuItems: XcMenuItem[] | (() => XcMenuItem[]);

    @Input()
    disabled = false;

    @Output()
    readonly beforeOpen = new EventEmitter<void>();

    @HostListener('contextmenu', ['$event'])
    onContextMenu(event: MouseEvent): void {

        if (this.disabled) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const trigger = this.contextMenuService.trigger;

        const open = () => {
            if (this.contextMenuItems) {
                const items = Array.isArray(this.contextMenuItems) ? this.contextMenuItems : this.contextMenuItems?.();

                if (items) {
                    this.menuService.set(items);
                }
            }

            this.beforeOpen.emit();

            queueMicrotask(() => {
                trigger?.openAt(event.clientX, event.clientY);
            });
        };

        if (trigger?.menuOpen) {

            // Reopen the menu at the new position once the previous instance
            // has been completely closed.
            trigger.menuClosed.pipe(take(1)).subscribe(() => open());

            trigger.closeMenu();
            return;
        } else {
            open();
        }
    }
}