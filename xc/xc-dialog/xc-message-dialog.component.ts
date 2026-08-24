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
import { signal } from '@angular/core';

import { XcDialogOptions } from './xc-dialog-wrapper.component';
import { XcDialogComponent } from './xc-dialog.component';


export abstract class XcMessageDialogComponent<R, D> extends XcDialogComponent<R, D> {
    private readonly titleState = signal('');
    private readonly messageState = signal('');
    private readonly detailsState = signal('');
    private readonly draggableState = signal(true);
    private readonly resizableState = signal(true);
    private readonly maximizableState = signal(true);
    private readonly dialogMaximizedState = signal(false);
    private readonly dialogOptionsState = signal<XcDialogOptions>({});

    get title(): string {
        return this.titleState();
    }

    set title(value: string) {
        this.titleState.set(value ?? '');
    }

    get message(): string {
        return this.messageState();
    }

    set message(value: string) {
        this.messageState.set(value ?? '');
    }

    get details(): string {
        return this.detailsState();
    }

    set details(value: string) {
        this.detailsState.set(value ?? '');
    }

    get draggable(): boolean {
        return this.draggableState();
    }

    set draggable(value: boolean) {
        this.draggableState.set(!!value);
    }

    get resizable(): boolean {
        return this.resizableState();
    }

    set resizable(value: boolean) {
        this.resizableState.set(!!value);
    }

    get maximizable(): boolean {
        return this.maximizableState();
    }

    set maximizable(value: boolean) {
        this.maximizableState.set(!!value);
    }

    get maximized(): boolean {
        return this.dialogMaximizedState();
    }

    set maximized(value: boolean) {
        this.dialogMaximizedState.set(!!value);
    }

    get dialogOptions(): XcDialogOptions {
        return this.dialogOptionsState();
    }

    set dialogOptions(value: XcDialogOptions) {
        this.dialogOptionsState.set(value ?? {});
    }
}
