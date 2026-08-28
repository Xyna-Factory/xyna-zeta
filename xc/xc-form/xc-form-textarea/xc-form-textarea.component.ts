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
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, effect, forwardRef, input, numberAttribute } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { coerceBoolean } from '@zeta/base';

import { XcFormBaseComponent } from '../xc-form-base/xc-form-base.component';


@Component({
    selector: 'xc-form-textarea',
    templateUrl: './xc-form-textarea.component.html',
    styleUrls: ['../xc-form-base/xc-form-base.component.scss', './xc-form-textarea.component.scss'],
    providers: [{ provide: XcFormBaseComponent, useExisting: forwardRef(() => XcFormTextareaComponent) }],
    imports: [MatFormField, MatLabel, MatInput, ReactiveFormsModule, CdkTextareaAutosize, MatError]
})
export class XcFormTextareaComponent extends XcFormBaseComponent {
    // @ViewChild(CdkTextareaAutosize) autosize: CdkTextareaAutosize;

    private _minLines = 5;
    private _maxLines = 5;
    private _textareaAutosize = true;
    readonly linesInput = input<number | undefined>(undefined, { alias: 'xc-form-textarea-lines', transform: numberAttribute });
    readonly minLinesInput = input<number | undefined>(undefined, { alias: 'xc-form-textarea-minlines', transform: numberAttribute });
    readonly maxLinesInput = input<number | undefined>(undefined, { alias: 'xc-form-textarea-maxlines', transform: numberAttribute });
    readonly textareaAutosizeInput = input(true, { alias: 'xc-form-textarea-autosize', transform: coerceBoolean });

    constructor() {
        super();
        effect(() => {
            const lines = this.linesInput();
            if (lines !== undefined) {
                this._minLines = lines;
                this._maxLines = lines;
                this._textareaAutosize = true;
            } else {
                const minLines = this.minLinesInput();
                const maxLines = this.maxLinesInput();
                this._minLines = minLines !== undefined ? minLines : this._minLines;
                this._maxLines = maxLines !== undefined ? maxLines : this._maxLines;
                this._textareaAutosize = this.textareaAutosizeInput();
            }
        });
    }

    /**
     * Sets height for the given number of lines
     */
    get lines(): number | undefined {
        return this.linesInput();
    }

    get minLines(): number {
        return this._minLines;
    }

    set minLines(value: number) {
        this._minLines = value;
    }

    get maxLines(): number {
        return this._maxLines;
    }

    set maxLines(value: number) {
        this._maxLines = value;
    }

    get textareaAutosize(): boolean {
        return this._textareaAutosize;
    }

    set textareaAutosize(value: boolean) {
        this._textareaAutosize = value;
    }
}
