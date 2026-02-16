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
import { Component, inject } from '@angular/core';

import { I18nService, LocaleService } from '../../i18n';
import { I18nModule } from '../../i18n/i18n.module';
import { XcSortDirection } from '../shared/xc-sort';
import { XcButtonComponent } from '../xc-button/xc-button.component';
import { XcDialogWrapperComponent } from '../xc-dialog/xc-dialog-wrapper.component';
import { XcDialogComponent } from '../xc-dialog/xc-dialog.component';
import { XcIconComponent } from '../xc-icon/xc-icon.component';
import { XcLocalTableDataSource } from '../xc-table/xc-local-table-data-source';
import { XcTableComponent } from '../xc-table/xc-table.component';
import { xcStatusBar_translations_de_DE } from './locale/xc-status-bar-translations.de-DE';
import { xcStatusBar_translations_en_US } from './locale/xc-status-bar-translations.en-US';
import { XcStatusBarEntry } from './xc-status-bar.service';
import { XcDialogWrapperComponent } from '../xc-dialog/xc-dialog-wrapper.component';
import { I18nModule } from '../../i18n/i18n.module';
import { XcButtonComponent } from '../xc-button/xc-button.component';
import { XcIconComponent } from '../xc-icon/xc-icon.component';
import { XcTableComponent } from '../xc-table/xc-table.component';


export interface XcStatusBarDialogData {
    entries: XcStatusBarEntry[];
}


@Component({
    templateUrl: './xc-status-bar-dialog.component.html',
    styleUrls: ['./xc-status-bar-dialog.component.scss'],
    imports: [XcDialogWrapperComponent, I18nModule, XcButtonComponent, XcIconComponent, XcTableComponent]
})
export class XcStatusBarDialogComponent extends XcDialogComponent<boolean, XcStatusBarDialogData> {
    readonly i18n = inject(I18nService);
    readonly dataSource: XcLocalTableDataSource;


    constructor() {
        super();

        this.i18n.setTranslations(LocaleService.DE_DE, xcStatusBar_translations_de_DE);
        this.i18n.setTranslations(LocaleService.EN_US, xcStatusBar_translations_en_US);

        this.dataSource = new XcLocalTableDataSource(this.i18n);
        this.dataSource.localTableData = {
            rows: this.injectedData.entries,
            columns: [
                { path: 'time', name: this.i18n.translate('Timestamp'), disableFilter: true, shrink: true, pre: true },
                { path: 'message', name: this.i18n.translate('Message') }
            ]
        };
        this.dataSource.setSortPathAndDirection('time', XcSortDirection.dsc);
        // this.dataSource.refresh();
    }
}
