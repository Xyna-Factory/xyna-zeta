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
import { Component, HostBinding, inject, signal } from '@angular/core';

import { XcDialogService } from '../xc-dialog/xc-dialog.service';
import { XcStatusBarDialogComponent } from './xc-status-bar-dialog.component';
import { XcStatusBarEntry, XcStatusBarEntryType, XcStatusBarService } from './xc-status-bar.service';
import { XcIconButtonComponent } from '../xc-button/xc-icon-button.component';


@Component({
    selector: 'xc-status-bar',
    templateUrl: './xc-status-bar.component.html',
    styleUrls: ['./xc-status-bar.component.scss'],
    imports: [XcIconButtonComponent]
})
export class XcStatusBarComponent {
    private readonly dialogService = inject(XcDialogService);
    private readonly statusBarService = inject(XcStatusBarService);


    private readonly entriesState = signal<XcStatusBarEntry[]>([]);
    private timeout: any;

    readonly typeState = signal<XcStatusBarEntryType>(XcStatusBarEntryType.NONE);

    readonly messageState = signal<string | undefined>(undefined);
    readonly collapsedState = signal(true);


    @HostBinding('attr.flashing')
    get flashing(): XcStatusBarEntryType {
        return this.typeState();
    }


    constructor() {
        this.statusBarService.displayStatusBarEntry.subscribe(
            entry => this.add(entry)
        );
    }


    flash(type: XcStatusBarEntryType) {
        this.typeState.set(XcStatusBarEntryType.NONE);
        if (type !== XcStatusBarEntryType.NONE) {
            setTimeout(() => this.typeState.set(type), 0);
        }
    }


    show(message: string) {
        this.messageState.set(message);
        this.collapsedState.set(false);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.collapsedState.set(true);
            this.timeout = setTimeout(() => {
                this.timeout = undefined;
                this.messageState.set(undefined);
            }, 600);
        }, 5000);
    }


    open() {
        this.dialogService.custom(
            XcStatusBarDialogComponent,
            {entries: this.entries}
        ).afterDismissResult(true).subscribe(() =>
            this.clear()
        );
    }


    clear() {
        this.entriesState.set([]);
    }


    add(entry: XcStatusBarEntry) {
        this.entriesState.update(entries => [...entries, entry]);
        this.flash(entry.type);
        this.show(entry.message);
    }


    get count(): number {
        return this.entriesState().length;
    }


    get entries(): XcStatusBarEntry[] {
        return this.entriesState();
    }
}
