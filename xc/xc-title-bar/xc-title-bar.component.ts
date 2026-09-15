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
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { getBaseHref, isArray } from '@zeta/base';

import { XcDialogService } from '../xc-dialog/xc-dialog.service';

import packageInfo from '../../package.json';
import { XcIconComponent } from '../xc-icon/xc-icon.component';


@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'xc-title-bar',
    templateUrl: './xc-title-bar.component.html',
    styleUrls: ['./xc-title-bar.component.scss'],
    imports: [XcIconComponent]
})
export class XcTitleBarComponent {
    private readonly dialogService = inject(XcDialogService);


    readonly applicationName = input<string>(undefined, { alias: "xc-title-bar-application-name" });

    readonly applicationVersions = input<string[]>(undefined, { alias: "xc-title-bar-application-versions" });

    readonly iconName = input<string>(undefined, { alias: "xc-title-bar-icon-name" });

    readonly iconStyle = input<string>(undefined, { alias: "xc-title-bar-icon-style" });

    readonly company = input<string>(undefined, { alias: "xc-title-bar-company" });

    readonly year = input<string>(undefined, { alias: "xc-title-bar-year" });


    private get copyright(): string {
        const company = this.company() || '';
        const year = this.year() || '';
        if (company || year) {
            return 'Copyright: ' + company + (company && year ? ', ' + year : '');
        }
        return '';
    }


    private get versions(): string {
        const applicationVersions = this.applicationVersions();
        return 'Xyna Zeta: ' + packageInfo.version +
               (isArray(applicationVersions) ? '\n\n' + applicationVersions.join('\n') : '');
    }


    showAbout() {
        this.dialogService.about(
            this.applicationName() || 'Info',
            this.copyright,
            this.versions,
            getBaseHref() + '3rdpartylicenses.txt'
        );
    }
}
