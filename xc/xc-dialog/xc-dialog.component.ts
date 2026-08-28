
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
import { Observable } from 'rxjs';

import { Component, DestroyRef, HostListener, inject, InjectionToken, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { XcDynamicDismissableComponent } from '../shared/xc-dynamic-dismissable.component';
import { XcDialogWrapperComponent } from './xc-dialog-wrapper.component';


@Component({
    template: '',
})

export abstract class XcDialogComponent<R = void, D = void>
    extends XcDynamicDismissableComponent<R, D> {

    private readonly dialogRef = inject(MatDialogRef<any>);
    private readonly destroyRef = inject(DestroyRef);

    private readonly wrapper = viewChild(XcDialogWrapperComponent);

    private readonly maximizedState = signal(false);

    protected get _maximized(): boolean {
        return this.maximizedState();
    }

    protected set _maximized(value: boolean) {
        this.maximizedState.set(value);
    }

    constructor() {
        super();
    }


    ngAfterViewInit() {
        const wrapper = this.wrapper();
        if (wrapper) {
            wrapper.maximizedChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
                this._maximized = value;
            });
        }
    }

    protected getToken(): InjectionToken<D> {
        return MAT_DIALOG_DATA;
    }

    @HostListener('keydown.Escape')
    dismiss(result?: R) {
        this.dialogRef.close(result);
    }

    afterDismiss(): Observable<R> {
        return this.dialogRef.afterClosed();
    }


    toggleMaximize(event: Event) {
        this._maximized = !this._maximized;

        const wrapper = this.wrapper();
        if (wrapper) {
            wrapper.maximized = this._maximized;
        }

        event.preventDefault();
    }
}
