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
import { merge, Observable, OperatorFunction, Subject, Subscription } from 'rxjs';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';

import { AfterViewInit, Component, computed, effect, ElementRef, EventEmitter, forwardRef, HostBinding, inject, input, NgZone, OnDestroy, Output, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MULTISELECT_FILTER_SEPARATOR } from '@zeta/xc/xc-table/xc-table-data-source';

import { A11yService } from '../../../a11y';
import { Xo, XoObject, XoPropertyBinding } from '../../../api';
import { coerceBoolean, Comparable, isObject, isString, isTextOverflowing, Native, NativeArray } from '../../../base';
import { I18nService, XcI18nPipe } from '../../../i18n';
import { XcBoxableDataWrapper } from '../../shared/xc-data-wrapper';
import { XcDynamicString, XcOptionItem, XcOptionItemString, XcOptionItemValueType } from '../../shared/xc-item';
import { XcSortDirection, XcSortDirectionFromString, XcSortPredicate } from '../../shared/xc-sort';
import { XcIconComponent } from '../../xc-icon/xc-icon.component';
import { XcTooltipDirective, XcTooltipPosition } from '../../xc-tooltip/xc-tooltip.directive';
import { XcFormBaseComponent } from '../xc-form-base/xc-form-base.component';
import { XcFormBaseInputComponent } from '../xc-form-base/xc-form-baseinput.component';


interface FromXoEnumeratedPropertyCallbacks {
    setter?: (value: Native) => Native | void;
    options?: (value: XcOptionItem[]) => void;
}


export class XcAutocompleteDataWrapper<V = XcOptionItemValueType> extends XcBoxableDataWrapper<XcOptionItem<V>, V> {

    private readonly _valuesChange = new Subject<XcOptionItem<V>[]>();
    private _values: XcOptionItem<V>[];
    private _value: XcOptionItem<V>;


    static getXoEnumeratedValuesMapper<W = XcOptionItemValueType>(): OperatorFunction<NativeArray, XcOptionItem<W>[]> {
        return map((data: any[]) => data.map(value => <XcOptionItem>{ name: signal(`${value}`), value: value }));
    }

    static getXoEnumeratedOptionItems<W = XcOptionItemValueType>(instance: Xo, propertyPath: string): Observable<XcOptionItem<W>[]> {
        const resolved = instance.resolveHead(propertyPath);
        const propertyHost = resolved.value;
        const propertyName = resolved.tail;
        if (propertyHost instanceof XoObject && propertyName) {
            const observable = propertyHost.enumeratedProperties.get(propertyName);
            if (observable) {
                return observable.pipe(
                    XcAutocompleteDataWrapper.getXoEnumeratedValuesMapper(),
                    tap((items: XcOptionItem[]) => items.unshift(XcOptionItemString()))
                );
            }
        }
    }

    static fromXoEnumeratedPropertyPath(instance: Xo, propertyPath: string, boxed = false, callbacks: FromXoEnumeratedPropertyCallbacks = {}): XcAutocompleteDataWrapper {
        const resolved = instance.resolveHead(propertyPath);
        const propertyHost = resolved.value;
        const propertyName = resolved.tail;
        if (propertyHost instanceof XoObject && propertyName) {
            const observable = propertyHost.enumeratedProperties.get(propertyName);
            if (observable) {
                return new XcAutocompleteDataWrapper(
                    // getter
                    () => propertyHost[propertyName],
                    // setter
                    callbacks.setter
                        ? value => propertyHost[propertyName] = callbacks.setter(value) || value
                        : value => propertyHost[propertyName] = value,
                    // xc option item mapped observable
                    observable.pipe(
                        XcAutocompleteDataWrapper.getXoEnumeratedValuesMapper(),
                        tap(callbacks.options)
                    ),
                    boxed
                );
            }
        }
    }

    static fromXoEnumeratedPropertyBinding<T extends XoObject, U extends Native>(binding: XoPropertyBinding<T, U>, boxed = false, callbacks: FromXoEnumeratedPropertyCallbacks = {}): XcAutocompleteDataWrapper {
        if (binding.instance && binding.accessor) {
            const propertyPaths = <any>binding.instance.decoratorClass.getAccessorMap();
            const propertyPath = <any>binding.accessor(propertyPaths);
            if (!isObject(propertyPath)) {
                const dataWrapper = XcAutocompleteDataWrapper.fromXoEnumeratedPropertyPath(binding.instance, propertyPath, boxed, callbacks);
                if (dataWrapper) {
                    return dataWrapper;
                }
                console.warn('fromXoEnumeratedPropertyBinding: accessor of binding does not yield an enumerated property');
            } else {
                console.warn('fromXoEnumeratedPropertyBinding: accessor of binding yields an xo instead of an enumerated property');
            }
        }
    }

    constructor(getter: () => V, setter: (value: V) => void, values?: XcOptionItem<V>[] | Observable<XcOptionItem<V>[]>, boxed = false) {
        super(getter, setter, boxed);
        if (values instanceof Array) {
            this.values = values;
        } else if (values) {
            values.subscribe(data => this.values = data);
        }
    }

    get valuesChange(): Observable<XcOptionItem<V>[]> {
        return this._valuesChange.asObservable();
    }

    set values(value: XcOptionItem<V>[]) {
        if (this._values !== value) {
            this._values = value;
            this.update();
        }
    }

    get values(): XcOptionItem<V>[] {
        return this._values;
    }

    set value(value: XcOptionItem<V>) {
        if (this._value !== value) {
            this._value = value;
            this.setter(this.value ? this.value.value : this.nullRepresentation);
        }
    }

    get value(): XcOptionItem<V> {
        return this._value;
    }

    preset(transform: (value: V) => XcOptionItem<V>) {
        this._value = transform(this.getter());
    }

    update() {
        if (this.values) {
            const getterValue = this.getter();
            const value = this.values.find(option =>
                option.value instanceof Comparable && getterValue instanceof Comparable
                    ? option.value.equals(getterValue)
                    : option.value === getterValue
            );
            if (value || !getterValue) {
                this._value = value;
            }
        }
        this._valuesChange.next(this.values);
    }
}

// this is an interface only used internally in the XcFormAutocompleteComponent class
interface XcOptionInternalAutocompleteItem extends XcOptionItem {
    showTooltip?: boolean;
}

@Component({
    selector: 'xc-form-autocomplete',
    templateUrl: './xc-form-autocomplete.component.html',
    styleUrls: ['../xc-form-base/xc-form-base.component.scss', './xc-form-autocomplete.component.scss'],
    providers: [{ provide: XcFormBaseComponent, useExisting: forwardRef(() => XcFormAutocompleteComponent) }],
    imports: [MatFormField, MatLabel, MatInput, ReactiveFormsModule, MatAutocompleteTrigger, MatAutocomplete, MatOption, XcTooltipDirective, XcIconComponent, MatError, MatIconButton, MatSuffix, MatIcon, XcI18nPipe, MatSelect]
})
export class XcFormAutocompleteComponent extends XcFormBaseInputComponent implements AfterViewInit, OnDestroy {
    protected readonly resolveDynamicString = (value: XcDynamicString) => value();
    readonly displayWith = (option: XcOptionItem) => this.optionName(option);
    private readonly a11yService = inject(A11yService);
    private readonly i18nService = inject(I18nService);
    private readonly elementRef = inject(ElementRef<HTMLElement>);
    private readonly ngZone = inject(NgZone);

    readonly tooltipPositions = [
        XcTooltipPosition.bottomRight,
        XcTooltipPosition.bottomLeft,
        XcTooltipPosition.topRight,
        XcTooltipPosition.topLeft
    ];

    /**
     * Screen Reader will read this string (translated) if this component is an autocomplete (default or asinput)
     * and there is no @Input for 'xc-form-autocomplete-a11yfocusline'
     */
    static globalAutocompleteA11yFocusLine = 'Autocomplete: You can type in text and select from options with the arrow keys';
    /**
     * Screen Reader will read this string (translated) if this component is asdropdown
     * and there is no @Input for 'xc-form-autocomplete-a11yfocusline'
     */
    static globalDropdownA11yFocusLine = 'Dropdown: You can switch between options with the arrow keys';

    /** determines whether the selected option can be reset to the first enabled option */
    private readonly selectedIdxResettableState = signal(false);

    /** index of selected option within filtered and sorted options */
    private readonly selectedIdxSignal = computed(() => this.filteredOptions().findIndex(option => option === this.selectedOption()));

    /** index of first enabled option within filtered and sorted options */
    private readonly enabledIdxSignal = computed(() => this.filteredOptions().findIndex(option => !option.disabled));

    private readonly openPanelWasJustClosedState = signal(false);
    private readonly suppressNextFocusEmitState = signal(false);

    protected _subscription: Subscription;
    private readonly sortDirectionState = signal(XcSortDirection.none);
    private readonly _optionsSignal = signal<XcOptionInternalAutocompleteItem[]>([]);
    readonly selectedOption = signal<XcOptionInternalAutocompleteItem | undefined>(undefined);
    readonly a11yFocusLine = input<string>('', { alias: 'xc-form-autocomplete-a11yfocusline' });
    readonly asInput = input(false, { alias: 'xc-form-autocomplete-asinput', transform: coerceBoolean });
    readonly asDropdown = input(false, { alias: 'xc-form-autocomplete-asdropdown', transform: coerceBoolean });
    readonly caseSensitive = input(false, { alias: 'xc-form-autocomplete-casesensitive', transform: coerceBoolean });
    readonly fullTextSearch = input(false, { alias: 'xc-form-autocomplete-fulltextsearch', transform: coerceBoolean });
    readonly option = input<XcOptionItem | undefined>(undefined, { alias: 'xc-form-autocomplete-option' });
    readonly options = input<XcOptionItem[] | undefined>(undefined, { alias: 'xc-form-autocomplete-options' });
    readonly sortDirection = input('none', { alias: 'xc-form-autocomplete-sortdirection' });
    private readonly filteredOptionsVersion = signal(0);
    private readonly formValueSignal = toSignal(
        this.formControl.valueChanges.pipe(debounceTime(10), startWith(this.formControl.value)),
        { initialValue: this.formControl.value }
    );

    readonly filteredOptions = computed(() => {
        this.filteredOptionsVersion();
        const value = this.formValueSignal();
        const normalizedValue = isObject(value) ? this.optionName(<XcOptionItem>value) : <string>value;
        const options = normalizedValue ? this.filter(normalizedValue) : this.copy();
        return this.sort(options);
    });

    get selectedIdx(): number {
        return this.selectedIdxSignal();
    }

    get enabledIdx(): number {
        return this.enabledIdxSignal();
    }

    get multiSelectA11yAnnouncement(): string {
        return this.multiSelectA11yAnnouncementState();
    }

    private refreshFilteredOptions() {
        this.filteredOptionsVersion.update(value => value + 1);
    }

    private readonly multiSelectEnabledState = signal(false);

    /** FormControl for mat-select in multiselect mode */
    multiSelectControl = new FormControl<string[]>([]);

    /** Options filtered for multiselect (excludes placeholder options with empty values) */
    filteredMultiSelectOptions: XcOptionItem[] = [];

    /** Last applied selection to restore on cancel */
    private readonly lastAppliedMultiSelectState = signal<string[]>([]);

    /** Previous multiselect value for tracking changes (screen reader) */
    private readonly previousMultiSelectValueState = signal<string[]>([]);

    /** Flag to track if panel was closed by user action (Apply/Cancel) */
    private readonly closedByUserActionState = signal(false);

    /** Screen reader announcement text */
    readonly multiSelectA11yAnnouncementState = signal('');


    readonly trigger = viewChild(MatAutocompleteTrigger);

    /** Reference to mat-select for multiselect mode */
    readonly multiSelectDropdown = viewChild<MatSelect>('multiSelectDropdown');

    /** Reference to multiselect input for focus management */
    readonly multiSelectInputElement = viewChild<ElementRef<HTMLInputElement>>('multiSelectInput');

    @Output('xc-form-autocomplete-optionChange')
    readonly optionChange = new EventEmitter<XcOptionItem>();

    @Output('xc-form-autocomplete-optionsOpened')
    readonly optionsOpened = new EventEmitter();

    @Output('xc-form-autocomplete-optionsClosed')
    readonly optionsClosed = new EventEmitter();

    /**
     * Enable multiselect mode using mat-select with multiple attribute.
     * When enabled, users can select multiple options and values are
     * concatenated with MULTISELECT_FILTER_SEPARATOR ('|').
     */
    readonly multiSelect = input(false, { alias: 'xc-form-autocomplete-asmultiselect', transform: coerceBoolean });

    /**
     * Emits the MULTISELECT_FILTER_SEPARATOR-delimited string of selected values when multiselect is applied.
     */
    @Output('xc-form-autocomplete-multiSelectChange')
    readonly multiSelectChange = new EventEmitter<string>();


    constructor() {
        super();
        effect(() => {
            this.filteredOptions();
            if (this.asInput()) {
                this.setActiveItem(-1);
            }
        });
        effect(() => {
            const multiSelect = this.multiSelect();
            if (multiSelect && !this.multiSelectEnabledState()) {
                this.initMultiSelectOptions();
                this.suffix = 'dropdown';
            }
            this.multiSelectEnabledState.set(multiSelect);
        });
        effect(() => {
            const option = this.option();
            if (option !== this.selectedOption()) {
                this.selectedOption.set(option);
                this.value = option;
            }
        });
        effect(() => {
            const options = this.options();
            this._optionsSignal.set((options ?? []) as XcOptionInternalAutocompleteItem[]);
            this.refreshFilteredOptions();
            if (this.multiSelectEnabledState()) {
                this.updateMultiSelectOptions();
            }
        });
        effect(() => {
            this.asInput();
            this.refreshFilteredOptions();
        });
        effect(() => {
            if (this.asDropdown()) {
                this.suffix = 'dropdown';
            }
            this.refreshFilteredOptions();
        });
        effect(() => {
            this.caseSensitive();
            this.refreshFilteredOptions();
        });
        effect(() => {
            this.fullTextSearch();
            this.refreshFilteredOptions();
        });
        effect(() => {
            this.sortDirectionState.set(XcSortDirectionFromString(this.sortDirection()));
            this.refreshFilteredOptions();
        });
    }


    ngAfterViewInit() {
        const element = (this.elementRef.nativeElement as HTMLElement);
        this.ngZone.runOutsideAngular(() => {
            element.addEventListener('keydown', this.onkeydown);
            element.addEventListener('keyup', this.keyup);
        });

        // In multiselect mode, trigger may be undefined since mat-autocomplete isn't rendered
        const trigger = this.trigger();
        if (trigger) {
            // set subscription
            this._subscription = trigger.panelClosingActions.subscribe(() => {
                this.checkValue();
            });
            // prevent resetting of the active item by internal code
            (trigger as any)._resetActiveItem = () => {
                if (this.selectedIdxResettableState() && !this.asInput()) {
                    this.setActiveItem(this.enabledIdx);
                }
                this.selectedIdxResettableState.set(true);
            };
        }
    }


    ngOnDestroy() {
        // remove subscription
        if (this._subscription) {
            this._subscription.unsubscribe();
        }

        const element = (this.elementRef.nativeElement as HTMLElement);
        this.ngZone.runOutsideAngular(() => {
            element.removeEventListener('keydown', this.onkeydown);
            element.removeEventListener('keyup', this.keyup);
        });
    }


    private readonly onScrollIfAutocompleteIsOpen = (event: Event) => {
        // In multiselect mode, trigger may be undefined
        const trigger = this.trigger();
        if (!trigger) {
            return;
        }
        // Chrome on Windows triggers a scroll event if the browser needs to render a too big of a text into an input element
        // in this event, the event's target is the input element itself
        const targetIsInputElement = (event.target as HTMLElement).getAttribute ? ((event.target as HTMLElement).getAttribute('id') === this.input().id) : false;
        const targetIsOptionBox = trigger.autocomplete.panel ? event.target === trigger.autocomplete.panel.nativeElement : false;
        if (trigger.panelOpen && !targetIsInputElement && !targetIsOptionBox) {
            trigger.closePanel();
        }
    };


    protected suffixClickChangedValue(unfocusedInput: boolean) {
        this.suppressNextFocusEmitState.set(unfocusedInput);
        super.suffixClickChangedValue(unfocusedInput);
        this.checkValue();
        const trigger = this.trigger();
        if (trigger) {
            trigger.openPanel();
        }
    }


    protected checkValue() {
        let option: any;

        // value is a string?
        if (isString(this.value)) {
            // append new option as a fallback, if autocomplete is used as input
            const options = this.asInput()
                ? (this.options() ?? []).concat(XcOptionItemString(this.value))
                : (this.options() ?? []);
            // try to find an option with the given value
            option = options.find(o => !o.disabled && this.optionName(o) === this.value);
            // if no option was found, try to find one without case sensitivity
            if (option === undefined && !this.caseSensitive()) {
                option = options.find(o => !o.disabled && this.optionName(o).toLowerCase() === this.value.toLowerCase());
            }
        } else {
            // use value, if it's an option
            option = isObject(this.value) ? this.value : undefined;
        }

        // restore selected option, if it's already selected
        if (this.value && option === this.selectedOption()) {
            this.value = this.selectedOption();
        } else {
            // otherwise select new option
            this.select(option);
        }
    }


    protected sort(options: XcOptionItem[]) {
        const sortDirection = this.sortDirectionState();
        return (sortDirection !== XcSortDirection.none)
            ? options.sort(XcSortPredicate(sortDirection, this.caseSensitive() ? option => this.optionName(option) : option => this.optionName(option).toLowerCase()))
            : options;
    }


    protected copy(): XcOptionItem[] {
        return this.options()
            ? this.options().slice()
            : [];
    }


    protected filter(string: string): XcOptionItem[] {
        const result = this.options() || [];
        if (!this.asDropdown()) {
            return result.filter(option => {
                const optionName = this.caseSensitive() ? this.optionName(option) : this.optionName(option).toLowerCase();
                const other = this.caseSensitive() ? string : string.toLowerCase();
                return this.fullTextSearch()
                    ? optionName.indexOf(other) >= 0
                    : optionName.startsWith(other);
            });
        }
        return result;
    }


    protected setActiveItem(idx: number) {
        const trigger = this.trigger();
        if (trigger) {
            trigger.autocomplete._keyManager.setActiveItem(idx);
        }
    }


    protected select(value?: XcOptionItem) {
        if (this.selectedOption() !== value) {
            this.selectedOption.set(value);
            this.value = value;
            this.optionChange.emit(value);
        }
    }


    mousedown(event: MouseEvent) {
        const trigger = this.trigger();
        if (!this.readonly && !this.disabled && trigger) {
            if (this.asDropdown()) {
                event.preventDefault();
                if (trigger.panelOpen) {
                    trigger.closePanel();
                } else {
                    trigger.openPanel();
                }
            } else {
                trigger.openPanel();
            }
        }
    }

    suffixMouseDown(event: MouseEvent) {
        super.suffixMouseDown(event);
        this.mousedown(event);
    }

    /**
     * Override suffixClick to open multiselect panel when clicking the dropdown arrow.
     */
    suffixClick(event: MouseEvent) {
        if (this.multiSelect() && !this.disabled && !this.readonly) {
            event.stopPropagation();
            this.openMultiSelectPanel(event);
        } else {
            super.suffixClick(event);
        }
    }


    onkeydown = (event: KeyboardEvent) => {
        // In multiselect mode, trigger may be undefined
        const trigger = this.trigger();
        if (!trigger) {
            return;
        }

        // trigger's panel is closed beforehand if user presses Enter
        // - therefore this.trigger.panelOpen is an insufficent indicator for checking if the panel was open
        const panelWasOpen = this.openPanelWasJustClosedState() || trigger.panelOpen;

        // prevent firefox from typing text into input field
        // is ctrl or alt true then this keydown event may be a short cut and default must not prevented
        if (!event.ctrlKey && !event.altKey && this.asDropdown() && event.key !== 'Tab') {
            event.preventDefault();
        }

        if (event.key === 'Escape' || event.key === 'Enter') {
            trigger.closePanel();
            this.checkValue();
            if (panelWasOpen) {
                event.stopPropagation();
            }
        }

        // should run in Angular's zone to avoid compatible problems
        this.ngZone.run(() => {
            super.onkeydown(event);
        });
    };


    keyup = (event: KeyboardEvent) => {

        // trigger's panel is closed beforehand if user presses Enter
        // - therefore this.trigger.panelOpen is a bad indicator for checking if the panel was open
        const panelWasOpen = this.openPanelWasJustClosedState();
        this.openPanelWasJustClosedState.set(false);

        if (panelWasOpen && event.key === 'Escape' || event.key === 'Enter') {
            event.stopPropagation();
        }

        // In multiselect mode, trigger may be undefined
        const trigger = this.trigger();
        if (!trigger) {
            return;
        }

        // fixes bug which sometimes caused the panel to be closed after clearing the input all at once
        // (via CTRL+BACKSPACE / CTRL+DELETE or, with the input's text being selected, via CTRL+X / BACKSPACE / DELETE)
        // not opening if tabbed to, while pressing "Tab" or "Tab + Shift"
        const notAllowed = ['Enter', 'Escape', 'Tab', 'Shift'];
        if (!trigger.panelOpen && !this.input().value && !notAllowed.includes(event.key)) {
            this.value = undefined;
            trigger.openPanel();
        }
    };


    onfocus(event: FocusEvent) {
        // suppress focus emit, if necessary
        if (!this.suppressNextFocusEmitState()) {
            this.focus.emit(event);
        }
        this.suppressNextFocusEmitState.set(false);

        // In multiselect mode, trigger may be undefined since mat-autocomplete isn't rendered
        const trigger = this.trigger();
        if (trigger) {
            // the autocomplete is being disabled and therefore the trigger won't auto-opening the panel as it would usually do
            trigger.autocompleteDisabled = true;
            setTimeout(() => {
                const triggerValue = this.trigger();
                if (triggerValue) {
                    triggerValue.autocompleteDisabled = false;
                }
            }, 0);
        }

        // TODO FIXME - it must be possible to prevent the MatAutocompleteTrigger's auto opening of the panel on focus
        // if so, we could get rid of the following a11y service method
        const txt = this.a11yFocusLine() || (this.label + ' '
            + this.i18nService.translateSignal(this.asDropdown()
                ? XcFormAutocompleteComponent.globalDropdownA11yFocusLine
                : XcFormAutocompleteComponent.globalAutocompleteA11yFocusLine)());
        this.a11yService.screenreaderSpeak(txt);
    }


    onblur(event: FocusEvent) {
        // suppress next focus emit, after clicking an option (which refocuses the input)
        if (event.relatedTarget instanceof HTMLElement) {
            this.suppressNextFocusEmitState.set(event.relatedTarget.classList.contains('mat-option'));
        }
        // click on disabled options should not unfocus input field!
        if (event.relatedTarget instanceof HTMLElement && event.relatedTarget.classList.contains('mat-option-disabled')) {
            this.setFocus();
        } else {
            // fixes weird bug where autocomplete would not close when focusing an input or button afterwards
            // In multiselect mode, trigger may be undefined since mat-autocomplete isn't rendered
            const trigger = this.trigger();
            if (trigger && (event.relatedTarget instanceof HTMLInputElement || event.relatedTarget instanceof HTMLButtonElement)) {
                trigger.closePanel();
                // check value for actions within focusing event
                this.checkValue();
            }
            this.blur.emit(event);
        }
    }


    @HostBinding('class.as-dropdown')
    get asDropdownHost(): boolean {
        return this.asDropdown();
    }


    get stringValue(): string {
        return (
            isObject(this.value) ? this.value.name : this.value
        ) ?? '';
    }


    /**
     * Active option chosen by arrow keys (not to be confused with selected option)
     */
    get activeOption(): XcOptionItem {
        return this.trigger()?.activeOption?.value;
    }


    optionSelected(option: MatOption) {
        this.select(this.value);
        // deselect active option, since we don't want that feature here
        option.deselect();
    }


    openedAutocomplete() {
        // listen to scroll events to close the options and avoiding that the autocomplete scrolls away
        window.addEventListener('scroll', this.onScrollIfAutocompleteIsOpen, true);
        // restore active item to previously selected item
        if (!this.asInput()) {
            this.setActiveItem(Math.max(this.selectedIdx, 0) || this.enabledIdx);
        }
        this.selectedIdxResettableState.set(false);
        // emit event
        this.optionsOpened.emit();

        // decide, if tooltip is needed
        // ----------------------------

        // In multiselect mode, trigger may be undefined
        const trigger = this.trigger();
        if (!trigger) {
            return;
        }

        // getting the listbox, in which all option elements are
        const listbox = document.body.querySelector('#' + trigger.autocomplete.id);

        Array.from(listbox.children).forEach((matOptionElement: Element) => {
            // which option's box is too small for its content

            const mouseEnterMatOptionOneTimeListener = () => {
                // remove event listener because we need to calculate test overflow only once
                matOptionElement.removeEventListener('mouseenter', mouseEnterMatOptionOneTimeListener);

                // test if text is overflowing
                // ---------------------------

                // get the html element that holds the text of a XcOptionItem.name
                const subElements = Array.from(matOptionElement.querySelectorAll('*'));
                subElements.forEach(el => {
                    const childNodes = Array.from((el as HTMLElement).childNodes);
                    childNodes.forEach(childNode => {
                        if (childNode.nodeType === childNode.TEXT_NODE) {
                            const option = this.options().find(op => this.optionName(op) === childNode.nodeValue.trim()) as XcOptionInternalAutocompleteItem;
                            if (option) {

                                const isOverflowing = isTextOverflowing(childNode.parentElement, this.optionName(option));

                                // is there change
                                if (!!option.showTooltip !== isOverflowing) {
                                    option.showTooltip = isOverflowing;
                                    if (option.showTooltip) {
                                        const mouseEnterEvent = new MouseEvent('mouseenter');
                                        matOptionElement.dispatchEvent(mouseEnterEvent);
                                    } else {
                                        const mouseLeaveEvent = new MouseEvent('mouseleave');
                                        matOptionElement.dispatchEvent(mouseLeaveEvent);
                                    }
                                }
                            }
                        }
                    });
                });
            };

            matOptionElement.addEventListener('mouseenter', mouseEnterMatOptionOneTimeListener);
        });
    }


    closedAutocomplete() {
        // do not listen anymore, because the listener is expensive
        window.removeEventListener('scroll', this.onScrollIfAutocompleteIsOpen, true);
        // emit event
        this.optionsClosed.emit();
        this.openPanelWasJustClosedState.set(true);
    }


    optionName(option: XcOptionItem): string {
        return option?.name ? option.name() : '';
    }


    // ========== Multiselect methods (mat-select based) ==========

    /**
     * Initialize options for multiselect mode.
     * Filters out any placeholder options with empty/null values.
     */
    private initMultiSelectOptions(): void {
        this.filteredMultiSelectOptions = (this.options() || []).filter(o => {
            // Filter out empty placeholder options
            return o.value !== null && o.value !== undefined && o.value !== '';
        });
        this.lastAppliedMultiSelectState.set([]);
        this.multiSelectControl.setValue([]);
    }

    /**
     * Updates multiselect options without resetting the current selection.
     * Called when options change after multiselect is already active.
     */
    private updateMultiSelectOptions(): void {
        this.filteredMultiSelectOptions = (this.options() || []).filter(o => {
            return o.value !== null && o.value !== undefined && o.value !== '';
        });
    }

    /**
     * Returns display string showing selected option names.
     */
    getMultiSelectedNames(): string {
        const values = this.multiSelectControl.value || [];
        if (values.length === 0) {
            return '';
        }
        return values
            .map(val => {
                const opt = this.filteredMultiSelectOptions.find(o => o.value === val);
                return opt ? this.optionName(opt) : val;
            })
            .join(', ');
    }

    /**
     * Opens the mat-select panel programmatically.
     * Focus moves to mat-select for native keyboard navigation.
     */
    openMultiSelectPanel(event: Event): void {
        if (this.readonly || this.disabled) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        const multiSelectDropdown = this.multiSelectDropdown();
        if (multiSelectDropdown && !multiSelectDropdown.panelOpen) {
            multiSelectDropdown.open();
            // Focus mat-select for native arrow/space handling
            setTimeout(() => this.multiSelectDropdown()?.focus(), 0);
        }
    }

    /**
     * Handles keyboard events on the INPUT element.
     * Opens panel on Arrow/Space/Enter keys.
     */
    onMultiSelectKeydown(event: KeyboardEvent): void {
        if (this.readonly || this.disabled) {
            return;
        }

        switch (event.key) {
            case 'Enter':
            case ' ':
            case 'ArrowDown':
            case 'ArrowUp':
                event.preventDefault();
                event.stopPropagation();
                this.openMultiSelectPanel(event);
                break;
        }
    }

    // Original _handleKeydown method backup
    private _originalHandleKeydown: ((event: KeyboardEvent) => void) | null = null;

    /**
     * Handles selection change for screen reader announcements.
     */
    onMultiSelectSelectionChange(event: any): void {
        const currentValues: string[] = event.value || [];
        const previousValues = this.previousMultiSelectValueState();

        // Determine which option changed
        let changedValue: string | undefined;
        let isNowSelected: boolean;

        if (currentValues.length > previousValues.length) {
            // Option was added
            changedValue = currentValues.find(v => !previousValues.includes(v));
            isNowSelected = true;
        } else if (currentValues.length < previousValues.length) {
            // Option was removed
            changedValue = previousValues.find(v => !currentValues.includes(v));
            isNowSelected = false;
        }

        // Update previous value for next comparison
        this.previousMultiSelectValueState.set([...currentValues]);

        if (changedValue) {
            const opt = this.filteredMultiSelectOptions.find(o => o.value === changedValue);
            if (opt) {
                const stateKey = isNowSelected
                    ? 'zeta.xc-form.autocomplete.selected'
                    : 'zeta.xc-form.autocomplete.not-selected';
                const state = this.i18nService.translateSignal(stateKey)();
                // Clear first, then set in microtask to ensure aria-live re-announces
                this.multiSelectA11yAnnouncementState.set('');
                queueMicrotask(() => {
                    this.multiSelectA11yAnnouncementState.set(`${this.optionName(opt)}, ${state}`);
                });
            }
        }
    }

    /**
     * Returns the aria-label for a multiselect option, including its selection state.
     * Used on mat-option so the screen reader announces "OptionName, selected/not selected"
     * when navigating with arrow keys (via aria-activedescendant).
     */
    getMultiSelectOptionAriaLabel(option: XcOptionItem): string {
        const currentValues = this.multiSelectControl.value || [];
        const isSelected = currentValues.includes(option.value);
        const stateKey = isSelected
            ? 'zeta.xc-form.autocomplete.selected'
            : 'zeta.xc-form.autocomplete.not-selected';
        const state = this.i18nService.translateSignal(stateKey)();
        return `${this.optionName(option)}, ${state}`;
    }

    /**
     * Handles mat-select openedChange event.
     * Patches _handleKeydown to intercept ENTER and ESC.
     */
    onMultiSelectOpenedChange(opened: boolean): void {
        if (opened) {
            // Reset user action flag
            this.closedByUserActionState.set(false);

            // Save current state for cancel
            this.lastAppliedMultiSelectState.set([...(this.multiSelectControl.value || [])]);
            // Initialize previous value for screen reader tracking
            this.previousMultiSelectValueState.set([...(this.multiSelectControl.value || [])]);

            // Patch mat-select's _handleKeydown to intercept ENTER and ESC
            const multiSelectDropdown = this.multiSelectDropdown();
            if (multiSelectDropdown && !this._originalHandleKeydown) {
                const matSelect = multiSelectDropdown as any;
                this._originalHandleKeydown = matSelect._handleKeydown.bind(matSelect);
                matSelect._handleKeydown = (event: KeyboardEvent) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        this.applyMultiSelect();
                        return;
                    }
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        this.cancelMultiSelect();
                        return;
                    }
                    this._originalHandleKeydown!(event);
                };
            }

            this.optionsOpened.emit();
        } else {
            // Restore original _handleKeydown
            const multiSelectDropdown = this.multiSelectDropdown();
            if (multiSelectDropdown && this._originalHandleKeydown) {
                (multiSelectDropdown as any)._handleKeydown = this._originalHandleKeydown;
                this._originalHandleKeydown = null;
            }

            // If panel was closed without user action (focus-out), restore previous selection
            if (!this.closedByUserActionState()) {
                this.multiSelectControl.setValue([...this.lastAppliedMultiSelectState()]);
            }
            this.closedByUserActionState.set(false);

            this.optionsClosed.emit();
            // Return focus to input
            this.multiSelectInputElement()?.nativeElement?.focus();
        }
    }

    /**
     * Applies the current multiselect selection.
     * Emits concatenated values with MULTISELECT_FILTER_SEPARATOR.
     */
    applyMultiSelect(): void {
        const selectedValues = this.multiSelectControl.value || [];
        const joinedValue = selectedValues.join(MULTISELECT_FILTER_SEPARATOR);

        // Update the component's value
        this.value = joinedValue;

        // Save as last applied
        this.lastAppliedMultiSelectState.set([...selectedValues]);

        // Emit the change
        this.multiSelectChange.emit(joinedValue);

        // Mark as user-initiated close
        this.closedByUserActionState.set(true);

        // Close the panel
        const multiSelectDropdown = this.multiSelectDropdown();
        if (multiSelectDropdown) {
            multiSelectDropdown.close();
        }
    }

    /**
     * Cancels multiselect and restores previous selection.
     */
    cancelMultiSelect(): void {
        // Restore previous selection
        this.multiSelectControl.setValue([...this.lastAppliedMultiSelectState()]);

        // Mark as user-initiated close
        this.closedByUserActionState.set(true);

        // Close the panel
        const multiSelectDropdown = this.multiSelectDropdown();
        if (multiSelectDropdown) {
            multiSelectDropdown.close();
        }
    }

}
