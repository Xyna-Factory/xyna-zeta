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
import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';

import { AuthService } from '../../auth/auth.service';
import { isString } from '../../base';


@Directive({ selector: '[xc-has-right]' })
export class XcHasRightDirective {
    private readonly authService = inject(AuthService);
    private readonly viewContainerRef = inject(ViewContainerRef);
    private readonly templateRef = inject<TemplateRef<any>>(TemplateRef);



    @Input('xc-has-right')
    set neededRights(value: string) {

        const rightsArray = (isString(value) ? value.split(',') : [])
            .map(item => item.trim()) // trims trailing whitespaces
            .filter(right => right);  // filters out empty elements

        const hide = rightsArray.some(
            right => !this.authService.hasRight(right)
        );

        if (hide) {
            this.viewContainerRef.clear();
        } else {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
    }
}
