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
import { ChangeDetectionStrategy, Component, contentChildren, effect, ElementRef, HostBinding, HostListener, input, output, signal, viewChild } from '@angular/core';
import { MatDrawerContainer, MatDrawerContent, MatDrawer } from '@angular/material/sidenav';

import { coerceBoolean } from '../../base';
import { XcMasterDetailFocusCandidateDirective } from './xc-master-detail-focuscandidate.directive';


type XcMasterDetailSideAreaSize = 'small' | 'golden' | 'half' | 'large' | 'full';
type XcMasterDetailMode = 'side' | 'over';
type XcMasterDetailPosition = 'start' | 'end';


@Component({
    selector: 'xc-master-detail',
    templateUrl: './xc-master-detail.component.html',
    styleUrls: ['./xc-master-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDrawerContainer, MatDrawerContent, MatDrawer]
})
export class XcMasterDetailComponent {

    private readonly drawerContainer = viewChild(MatDrawerContainer);
    private readonly drawerContentEl = viewChild(MatDrawerContent);
    readonly focusCandidates = contentChildren(XcMasterDetailFocusCandidateDirective, { descendants: true });
    readonly openedChange = output<boolean>();

    readonly modeInput = input<XcMasterDetailMode>('side', { alias: 'xc-master-detail-mode' });
    readonly positionInput = input<XcMasterDetailPosition>('end', { alias: 'xc-master-detail-position' });
    readonly openedInput = input(false, { alias: 'xc-master-detail-opened', transform: coerceBoolean });
    readonly escapableInput = input(false, { alias: 'xc-master-detail-escapable', transform: coerceBoolean });
    readonly sideAreaSizeInput = input<XcMasterDetailSideAreaSize>('golden', { alias: 'xc-master-detail-side-area-size' });

    private readonly _opened = signal(false);
    private readonly _mode = signal<XcMasterDetailMode>('side');
    private readonly _position = signal<XcMasterDetailPosition>('end');
    private readonly _escapable = signal(false);
    private readonly _sideAreaSize = signal<XcMasterDetailSideAreaSize>('golden');

    @HostBinding('attr.detail-mode')
    get mode(): XcMasterDetailMode {
        return this._mode();
    }


    get position(): XcMasterDetailPosition {
        return this._position();
    }


    get opened(): boolean {
        return this._opened();
    }


    get escapable(): boolean {
        return this._escapable();
    }


    @HostBinding('attr.side-area-size')
    get sideAreaSize(): XcMasterDetailSideAreaSize {
        return this._sideAreaSize();
    }


    @HostListener('window:resize')
    _onResize() {
        this.resize();
    }


    constructor() {
        effect(() => {
            this._mode.set(this.modeInput());
            this._position.set(this.positionInput());
            this._opened.set(this.openedInput());
            this._escapable.set(this.escapableInput());
            this._sideAreaSize.set(this.sideAreaSizeInput());
        });

        effect(() => {
            const drawerContentEl = this.drawerContentEl();
            if (!drawerContentEl) {
                return;
            }
            if (this._opened() && this._sideAreaSize() === 'full') {
                drawerContentEl.getElementRef().nativeElement.setAttribute('inert', '');
            } else {
                drawerContentEl.getElementRef().nativeElement.removeAttribute('inert');
            }
        });
    }


    openedChangeHandler(event: boolean) {
        this._opened.set(event);
        this.openedChange.emit(event);

        if (event) {
            const open = this.focusCandidates().find(can => can.moment === 'open');
            if (open) {
                open.focus();
            }
        } else {
            const close = this.focusCandidates().find(can => can.moment === 'close');
            if (close) {
                close.focus();
            }
        }
    }


    resize() {
        // autosize feature of MatDrawContainer can badly effect the overall performance
        // so it is only true until the next change detection, which is triggered by setTimeout
        const drawerContainer = this.drawerContainer();
        if (drawerContainer) {
            drawerContainer.autosize = true;
            // Promise.resolve().then(() => this._drawerContainer.autosize = false);
            window.setTimeout(() => drawerContainer.autosize = false, 0);
        }
    }
}
