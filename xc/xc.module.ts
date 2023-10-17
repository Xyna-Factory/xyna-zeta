import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';

import { I18nModule } from '../i18n';
import { XcContentEditableDirective } from './shared/xc-content-editable.directive';
import { XcDragDirective } from './shared/xc-drag.directive';
import { XcHasRightDirective } from './shared/xc-has-right.directive';
import { XcResizeDirective } from './shared/xc-resize.directive';
import { XcUnwrapDirective } from './shared/xc-unwrap.directive';
import { XcVarDirective } from './shared/xc-var.directive';
import { XcButtonBaseComponent } from './xc-button/xc-button-base.component';
import { XcButtonComponent } from './xc-button/xc-button.component';
import { XcIconButtonComponent } from './xc-button/xc-icon-button.component';
import { XcCanvasComponent } from './xc-canvas/xc-canvas.component';
import { XcCheckboxComponent } from './xc-checkbox/xc-checkbox.component';
import { XcAboutDialogComponent } from './xc-dialog/xc-about-dialog.component';
import { XcConfirmDialogComponent } from './xc-dialog/xc-confirm-dialog.component';
import { XcDialogWrapperComponent } from './xc-dialog/xc-dialog-wrapper.component';
import { XcDialogService } from './xc-dialog/xc-dialog.service';
import { XcInfoDialogComponent } from './xc-dialog/xc-info-dialog.component';
import { XcDefinitionListDefinitionComponent } from './xc-form/definitions/containers/xc-definition-list-definition/xc-definition-list-definition.component';
import { XcDefinitionListEntryComponent } from './xc-form/definitions/containers/xc-definition-list-definition/xc-definition-list-entry/xc-definition-list-entry.component';
import { XcDefinitionListUnwrapDirective } from './xc-form/definitions/containers/xc-definition-list-definition/xc-dl-unwrap.directive';
import { XcDefinitionProxyComponent } from './xc-form/definitions/containers/xc-definition-proxy/xc-definition-proxy.component';
import { XcFormDefinitionComponent } from './xc-form/definitions/containers/xc-form-definition/xc-form-definition.component';
import { XcFormPanelDefinitionComponent } from './xc-form/definitions/containers/xc-form-panel-definition/xc-form-panel-definition.component';
import { XcPredefinedTablePanelDefinitionComponent } from './xc-form/definitions/containers/xc-predefined-table-panel-definition/xc-predefined-table-panel-definition.component';
import { XcTablePanelDefinitionComponent } from './xc-form/definitions/containers/xc-table-panel-definition/xc-table-panel-definition.component';
import { XcTreePanelDefinitionComponent } from './xc-form/definitions/containers/xc-tree-panel-definition/xc-tree-panel-definition.component';
import { XcBaseDefinitionComponent } from './xc-form/definitions/shared/xc-base-definition/xc-base-definition.component';
import { XcFormGenericPanelComponent } from './xc-form/definitions/shared/xc-form-generic-panel/xc-form-generic-panel.component';
import { XcDefinitionStackItemComponent } from './xc-form/definitions/xc-definition-stack/xc-definition-stack-item/xc-definition-stack-item.component';
import { XcDefinitionStackMasterComponent } from './xc-form/definitions/xc-definition-stack/xc-definition-stack-master/xc-definition-stack-master.component';
import { XcFormAutocompleteComponent } from './xc-form/xc-form-autocomplete/xc-form-autocomplete.component';
import { XcFormBaseComponent, XcFormComponent } from './xc-form/xc-form-base/xc-form-base.component';
import { XcFormBaseInputComponent } from './xc-form/xc-form-base/xc-form-baseinput.component';
import { XcFormValidatorCustomDirective, XcFormValidatorEmailDirective, XcFormValidatorIpDirective, XcFormValidatorIpv4Directive, XcFormValidatorIpv6Directive, XcFormValidatorMaxLengthDirective, XcFormValidatorMaxValueDirective, XcFormValidatorMinLengthDirective, XcFormValidatorMinValueDirective, XcFormValidatorNumberDirective, XcFormValidatorPatternDirective, XcFormValidatorRequiredDirective, XcFormValidatorsDirective } from './xc-form/xc-form-base/xc-form-validators.directive';
import { XcFormDirective } from './xc-form/xc-form-base/xc-form.directive';
import { XcFormInputComponent } from './xc-form/xc-form-input/xc-form-input.component';
import { XcFormLabelComponent } from './xc-form/xc-form-label/xc-form-label.component';
import { XcFormTextComponent } from './xc-form/xc-form-text/xc-form-text.component';
import { XcFormTextareaComponent } from './xc-form/xc-form-textarea/xc-form-textarea.component';
import { XcGraphComponent } from './xc-graph/xc-graph.component';
import { XcIconService } from './xc-icon/xc-icon-service';
import { XcIconComponent } from './xc-icon/xc-icon.component';
import { XcLanguageSelectorComponent } from './xc-language-selector/xc-language-selector.component';
import { XcNavListItemComponent } from './xc-list/xc-nav-list/xc-nav-list-item/xc-nav-list-item.component';
import { XcNavListComponent } from './xc-list/xc-nav-list/xc-nav-list.component';
import { XcRichListComponent } from './xc-list/xc-rich-list/xc-rich-list.component';
import { XcMasterDetailFocusCandidateDirective } from './xc-master-detail/xc-master-detail-focuscandidate.directive';
import { XcMasterDetailComponent } from './xc-master-detail/xc-master-detail.component';
import { XcMenuTriggerDirective } from './xc-menu/xc-menu-trigger.directive';
import { XcMenuComponent } from './xc-menu/xc-menu.component';
import { XcMenuService, XcMenuServiceDirective } from './xc-menu/xc-menu.service';
import { XcPanelComponent } from './xc-panel/xc-panel.component';
import { XcPathBrowserComponent } from './xc-path-browser/xc-path-browser.component';
import { XcPlotComponent } from './xc-plot/xc-plot.component';
import { XcProgressBarComponent } from './xc-progress-bar/xc-progress-bar.component';
import { XcSpinnerComponent } from './xc-spinner/xc-spinner.component';
import { XcStackComponent } from './xc-stack/xc-stack.component';
import { XcStatusBarDialogComponent } from './xc-status-bar/xc-status-bar-dialog.component';
import { XcStatusBarComponent } from './xc-status-bar/xc-status-bar.component';
import { XcStatusBarService } from './xc-status-bar/xc-status-bar.service';
import { XcTabBarComponent } from './xc-tab-bar/xc-tab-bar.component';
import { XcTableComponent } from './xc-table/xc-table.component';
import { XcTemplateContainerComponent } from './xc-template/xc-template-container/xc-template-container.component';
import { XcTemplateComponent } from './xc-template/xc-template.component';
import { XcTitleBarComponent } from './xc-title-bar/xc-title-bar.component';
import { XcTooltipDirective } from './xc-tooltip/xc-tooltip.directive';
import { XcReadonlyTreeComponent } from './xc-tree/xc-readonly-tree/xc-readonly-tree.component';
import { XcTreeItemComponent } from './xc-tree/xc-readonly-tree/xc-tree-item/xc-tree-item.component';
import { XcTreeComponent } from './xc-tree/xc-tree.component';
import { XcWebGLComponent } from './xc-webgl/xc-webgl.component';


@NgModule({
    imports: [
        CommonModule,
        I18nModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatTooltipModule,
        MatTreeModule,
        ReactiveFormsModule,
        RouterModule,
        DragDropModule,
        FormsModule
    ],
    declarations: [
        XcAboutDialogComponent,
        XcButtonBaseComponent,
        XcButtonComponent,
        XcCanvasComponent,
        XcCheckboxComponent,
        XcConfirmDialogComponent,
        XcContentEditableDirective,
        XcDefinitionStackItemComponent,
        XcDefinitionStackMasterComponent,
        XcDialogWrapperComponent,
        XcDragDirective,
        XcFormAutocompleteComponent,
        XcFormBaseComponent,
        XcFormBaseInputComponent,
        XcFormComponent,
        XcFormDirective,
        XcFormGenericPanelComponent,
        XcFormInputComponent,
        XcFormLabelComponent,
        XcFormTextareaComponent,
        XcFormTextComponent,
        XcFormValidatorEmailDirective,
        XcFormValidatorMaxLengthDirective,
        XcFormValidatorMaxValueDirective,
        XcFormValidatorMinLengthDirective,
        XcFormValidatorMinValueDirective,
        XcFormValidatorNumberDirective,
        XcFormValidatorPatternDirective,
        XcFormValidatorRequiredDirective,
        XcFormValidatorIpv4Directive,
        XcFormValidatorIpv6Directive,
        XcFormValidatorIpDirective,
        XcFormValidatorCustomDirective,
        XcFormValidatorsDirective,
        XcGraphComponent,
        XcHasRightDirective,
        XcIconButtonComponent,
        XcIconComponent,
        XcInfoDialogComponent,
        XcLanguageSelectorComponent,
        XcMasterDetailComponent,
        XcMasterDetailFocusCandidateDirective,
        XcMenuComponent,
        XcMenuServiceDirective,
        XcMenuTriggerDirective,
        XcNavListComponent,
        XcNavListItemComponent,
        XcPanelComponent,
        XcPathBrowserComponent,
        XcPlotComponent,
        XcProgressBarComponent,
        XcReadonlyTreeComponent,
        XcResizeDirective,
        XcRichListComponent,
        XcSpinnerComponent,
        XcStackComponent,
        XcStatusBarComponent,
        XcStatusBarDialogComponent,
        XcTabBarComponent,
        XcTableComponent,
        XcTemplateComponent,
        XcTemplateContainerComponent,
        XcTitleBarComponent,
        XcTooltipDirective,
        XcTreeComponent,
        XcTreeItemComponent,
        XcUnwrapDirective,
        XcVarDirective,
        XcWebGLComponent,

        // Workflow-defined UI
        XcBaseDefinitionComponent,
        XcDefinitionListDefinitionComponent,
        XcDefinitionListEntryComponent,
        XcDefinitionListUnwrapDirective,
        XcDefinitionProxyComponent,
        XcFormDefinitionComponent,
        XcFormPanelDefinitionComponent,
        XcPredefinedTablePanelDefinitionComponent,
        XcTablePanelDefinitionComponent,
        XcTreePanelDefinitionComponent
    ],
    exports: [
        XcAboutDialogComponent,
        XcButtonBaseComponent,
        XcButtonComponent,
        XcCanvasComponent,
        XcCheckboxComponent,
        XcConfirmDialogComponent,
        XcContentEditableDirective,
        XcDefinitionListEntryComponent,
        XcDialogWrapperComponent,
        XcDragDirective,
        XcFormAutocompleteComponent,
        XcFormBaseComponent,
        XcFormBaseInputComponent,
        XcFormComponent,
        XcFormDirective,
        XcFormGenericPanelComponent,
        XcFormInputComponent,
        XcFormLabelComponent,
        XcFormTextareaComponent,
        XcFormTextComponent,
        XcFormValidatorEmailDirective,
        XcFormValidatorMaxLengthDirective,
        XcFormValidatorMaxValueDirective,
        XcFormValidatorMinLengthDirective,
        XcFormValidatorMinValueDirective,
        XcFormValidatorNumberDirective,
        XcFormValidatorPatternDirective,
        XcFormValidatorRequiredDirective,
        XcFormValidatorIpv4Directive,
        XcFormValidatorIpv6Directive,
        XcFormValidatorIpDirective,
        XcFormValidatorCustomDirective,
        XcFormValidatorsDirective,
        XcGraphComponent,
        XcHasRightDirective,
        XcIconButtonComponent,
        XcIconComponent,
        XcInfoDialogComponent,
        XcLanguageSelectorComponent,
        XcMasterDetailComponent,
        XcMasterDetailFocusCandidateDirective,
        XcMenuComponent,
        XcMenuServiceDirective,
        XcMenuTriggerDirective,
        XcNavListComponent,
        XcNavListItemComponent,
        XcPanelComponent,
        XcPathBrowserComponent,
        XcPlotComponent,
        XcProgressBarComponent,
        XcReadonlyTreeComponent,
        XcResizeDirective,
        XcRichListComponent,
        XcSpinnerComponent,
        XcStackComponent,
        XcStatusBarComponent,
        XcStatusBarDialogComponent,
        XcTabBarComponent,
        XcTableComponent,
        XcTemplateComponent,
        XcTitleBarComponent,
        XcTooltipDirective,
        XcTreeComponent,
        XcTreeItemComponent,
        XcUnwrapDirective,
        XcVarDirective,
        XcWebGLComponent,

        // Workflow-defined UI
        XcBaseDefinitionComponent,
        XcDefinitionListDefinitionComponent,
        XcDefinitionListUnwrapDirective,
        XcDefinitionProxyComponent,
        XcFormDefinitionComponent,
        XcFormPanelDefinitionComponent,
        XcPredefinedTablePanelDefinitionComponent,
        XcTablePanelDefinitionComponent,
        XcTreePanelDefinitionComponent
    ],
    providers: [
        XcDialogService,
        XcIconService,
        XcMenuService,
        XcStatusBarService
    ]
})
export class XcModule {
}
