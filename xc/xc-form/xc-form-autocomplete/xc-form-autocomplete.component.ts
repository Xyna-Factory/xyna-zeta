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
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, NgZone, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatSelect } from "@angular/material/select";

import { merge, Observable, OperatorFunction, Subject, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';

import { A11yService } from '../../../a11y';
import { Xo, XoObject, XoPropertyBinding } from '../../../api';
import { coerceBoolean, Comparable, isObject, isString, isTextOverflowing, Native, NativeArray } from '../../../base';
import { I18nService } from '../../../i18n';
import { XcBoxableDataWrapper } from '../../shared/xc-data-wrapper';
import { XcOptionItem, XcOptionItemString, XcOptionItemValueType } from '../../shared/xc-item';
import { XcSortDirection, XcSortDirectionFromString, XcSortPredicate } from '../../shared/xc-sort';
import { XcFormBaseComponent } from '../xc-form-base/xc-form-base.component';
import { XcFormBaseInputComponent } from '../xc-form-base/xc-form-baseinput.component';
import { ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { FormControl } from "@angular/forms";

interface FromXoEnumeratedPropertyCallbacks {
    setter?: (value: Native) => Native | void;
    options?: (value: XcOptionItem[]) => void;
}


export class XcAutocompleteDataWrapper<V = XcOptionItemValueType> extends XcBoxableDataWrapper<XcOptionItem<V>, V> {

    private readonly _valuesChange = new Subject<XcOptionItem<V>[]>();
    private _values: XcOptionItem<V>[];
    private _value: XcOptionItem<V>;


    static getXoEnumeratedValuesMapper<W = XcOptionItemValueType>(): OperatorFunction<NativeArray, XcOptionItem<W>[]> {
        return map((data: any[]) => data.map(value => <XcOptionItem>{ name: `${value}`, value: value }));
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class XcFormAutocompleteComponent extends XcFormBaseInputComponent implements AfterViewInit, OnDestroy {

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

    private readonly updateFilteredOptions = new Subject<XcOptionItem>();

    /** determines whether the selected option can be reset to the first enabled option */
    private selectedIdxResettable = false;

    /** index of selected option within filtered and sorted options */
    private selectedIdx = -1;

    /** index of first enabled option within filtered and sorted options */
    private enabledIdx = -1;

    private openPanelWasJustClosed = false;
    private suppressNextFocusEmit = false;

    protected _subscription: Subscription;
    protected _asInput = false;
    protected _asDropdown = false;
    protected _caseSensitive = false;
    protected _fullTextSearch = false;
    protected _sortDirection = XcSortDirection.none;
    protected _options = new Array<XcOptionInternalAutocompleteItem>();

    filteredOptions: Observable<XcOptionInternalAutocompleteItem[]>;
    selectedOption: XcOptionInternalAutocompleteItem;

    private hasUserInteracted = false;
    private blockFirstOpen = true;
    private deferOpenUntilNextTick = false;
    private hasSelectUserInteracted = false;
    private blockFirstOpenSelect = true;
    private deferOpenSelectUntilNextTick = false;
    private enteredFromOutsideCooldown = true;
    private multiKeyManager: ActiveDescendantKeyManager<MatOption>;
    private static readonly closeAllDropdowns$ = new Subject<XcFormAutocompleteComponent>();
    private closeAllSub: Subscription;
    private panelFocusInListener?: (ev: FocusEvent) => void;

    private static readonly ALL_VALUE = null;
    private msSwallowNextNav = false;


    @ViewChild("applyBtn", { static: false })
    applyBtnRef: ElementRef<HTMLButtonElement>;

    @ViewChild("cancelBtn", { static: false })
    cancelBtnRef: ElementRef<HTMLButtonElement>;

    @ViewChild(MatAutocompleteTrigger, { static: false })
    trigger: MatAutocompleteTrigger;

    @Input('xc-form-autocomplete-a11yfocusline')
    readonly a11yFocusLine: string;

    @Output('xc-form-autocomplete-optionChange')
    readonly optionChange = new EventEmitter<XcOptionItem>();

    @Output('xc-form-autocomplete-optionsOpened')
    readonly optionsOpened = new EventEmitter();

    @Output('xc-form-autocomplete-optionsClosed')
    readonly optionsClosed = new EventEmitter();


    constructor(
        private readonly cdRef: ChangeDetectorRef,
        private readonly a11yService: A11yService,
        private readonly i18nService: I18nService,
        private readonly elementRef: ElementRef,
        private readonly ngZone: NgZone
    ) {
        super(elementRef, i18nService);
        this.filteredOptions = merge(this.formControl.valueChanges.pipe(debounceTime(10)), this.updateFilteredOptions).pipe(
            // maps form option to string, if needed
            map((value: string | XcOptionItem) => isObject(value) ? this.optionName(<XcOptionItem>value) : <string>value),
            tap(() => this.asInput ? this.setActiveItem(-1) : null),
            // maps string to options array by filtering or copying
            map(value => value ? this.filter(value) : this.copy()),
            // sort options array by view
            map(array => this.sort(array)),
            // compute selected index
            tap(array => this.selectedIdx = array.findIndex(option => option === this.selectedOption)),
            // compute enabled index
            tap(array => this.enabledIdx = array.findIndex(option => !option.disabled))
        );
    }


      ngAfterViewInit() {
        const element = this.elementRef.nativeElement as HTMLElement;

        this.ngZone.runOutsideAngular(() => {
            element.addEventListener('keydown', this.onkeydown);
            element.addEventListener('keyup', this.keyup);
        });

        document.addEventListener('focusin', this.onDocumentFocusIn, true);
        document.addEventListener('mousedown', this.onDocumentMouseDown, true);

        // ---------- Disable default highlight for autocomplete dropdown ----------
        if (this.trigger && this.trigger.autocomplete && this.trigger.autocomplete._keyManager && this.multiSelect) {
            try {
                this.trigger.autocomplete._keyManager.setActiveItem(-1);
            } catch {
                (this.trigger.autocomplete._keyManager as any)._activeItemIndex = -1;
            }
        }

        const clearActiveVisuals = (panel: HTMLElement | undefined) => {
            if (!panel) return;
            panel.querySelectorAll('.mat-option.mat-active:not(.mat-selected)')?.forEach(el => el.classList.remove('mat-active'));
            panel.querySelectorAll('.mat-mdc-option.mdc-list-item--activated:not(.mdc-list-item--selected)')?.forEach(el => el.classList.remove('mdc-list-item--activated'));
            panel.querySelectorAll('.mat-mdc-option.mat-mdc-option-active:not(.mdc-list-item--selected)')?.forEach(el => el.classList.remove('mat-mdc-option-active'));
            const listbox = panel.querySelector('[role="listbox"]') as HTMLElement | null;
            listbox?.removeAttribute('aria-activedescendant');
        };

        if (this.trigger && this.multiSelect) {
            const triggerAny: any = this.trigger;
            const openFn = triggerAny.openPanel?.bind(triggerAny) || triggerAny.open?.bind(triggerAny);
            if (openFn) {
                triggerAny.openPanel = (...args: any[]) => {
                    // Always clear active item before opening
                    try {
                        if (triggerAny.autocomplete && triggerAny.autocomplete._keyManager) {
                            triggerAny.autocomplete._keyManager.setActiveItem(-1);
                        }
                    } catch {
                        (triggerAny.autocomplete._keyManager as any)._activeItemIndex = -1;
                    }

                    const postAttachCleanup = () => {
                        const panel = triggerAny.autocomplete?.panel?.nativeElement as HTMLElement | undefined;
                        clearActiveVisuals(panel);
                    };
                    queueMicrotask(postAttachCleanup);
                    requestAnimationFrame(postAttachCleanup);
                    setTimeout(postAttachCleanup, 0);

                    return openFn(...args);
                };
            }
        }

        if (this.trigger) {
            (this.trigger).autocompleteDisabled = true;

            requestAnimationFrame(() => {
                this.trigger.closePanel();
                requestAnimationFrame(() =>
                    Promise.resolve().then(() => this.trigger.closePanel()),
                );
            });

            this._subscription = this.trigger.panelClosingActions.subscribe(() => {
                this.checkValue();
                this.cdRef.detectChanges();
            });

            (this.trigger as any)._resetActiveItem = () => {
                if (this.selectedIdxResettable && !this.asInput) {
                    this.setActiveItem(this.enabledIdx);
                }
                this.selectedIdxResettable = true;
            };

            if (this.trigger.autocomplete?.options) {
                this.trigger.autocomplete._keyManager =
                    new ActiveDescendantKeyManager(this.trigger.autocomplete.options).withWrap();
            }
        }

        if (this.multiSelectDropdown) {
            requestAnimationFrame(() => {
                this.multiSelectDropdown.close();
                requestAnimationFrame(() =>
                    Promise.resolve().then(() => this.multiSelectDropdown.close()),
                );
            });

            const originalSelectOpen = this.multiSelectDropdown.open.bind(this.multiSelectDropdown);
            (this.multiSelectDropdown).open = () => {
                if (
                    this.blockFirstOpenSelect ||
                    this.deferOpenSelectUntilNextTick ||
                    this.enteredFromOutsideCooldown
                ) {
                    return;
                }

                const kmAny: any = (this.multiSelectDropdown)._keyManager || this.multiKeyManager;
                if (kmAny) {
                    try { kmAny.setActiveItem(-1); } catch { kmAny._activeItemIndex = -1; }
                }

                const postAttachCleanup = () => {
                    const panel = this.multiSelectDropdown.panel?.nativeElement as HTMLElement | undefined;
                    clearActiveVisuals(panel);
                };
                queueMicrotask(postAttachCleanup);
                requestAnimationFrame(postAttachCleanup);
                setTimeout(postAttachCleanup, 0);

                originalSelectOpen();
            };

            this.closeAllSub = XcFormAutocompleteComponent.closeAllDropdowns$.subscribe((origin) => {
                if (origin !== this && this.multiSelectDropdown?.panelOpen) {
                    this.multiSelectDropdown.close();
                }
            });

            this.multiSelectDropdown.openedChange.subscribe((opened) => {
                const panel = this.multiSelectDropdown.panel?.nativeElement as HTMLElement | undefined;

                if (
                    opened &&
                    (this.blockFirstOpenSelect ||
                        this.deferOpenSelectUntilNextTick ||
                        this.enteredFromOutsideCooldown)
                ) {
                    this.multiSelectDropdown.close();
                    return;
                }

                if (opened) {
                    XcFormAutocompleteComponent.closeAllDropdowns$.next(this);

                    if (this.multiSelectDropdown.options) {
                        const km = new ActiveDescendantKeyManager(this.multiSelectDropdown.options).withWrap();
                        (this.multiSelectDropdown)._keyManager = km;
                        this.multiKeyManager = km;
                        try { km.setActiveItem(-1); } catch { (km as any)._activeItemIndex = -1; }
                        this.cdRef.detectChanges();
                    } else {
                        this.multiKeyManager = undefined;
                    }

                    if (panel) {
                        panel.addEventListener('keydown', this.boundPanelKeydown, { capture: true });

                        const panelEl = panel;

                        // Remove active highlight on any pointer/mouse event
                        const clearActiveOnPointer = () => {
                            const kmAny: any = (this.multiSelectDropdown)._keyManager || this.multiKeyManager;
                            if (kmAny) {
                                try { kmAny.setActiveItem(-1); } catch { kmAny._activeItemIndex = -1; }
                            }
                            clearActiveVisuals(panelEl);
                            this.cdRef.detectChanges();
                        };

                        panelEl.addEventListener('click', () => queueMicrotask(clearActiveOnPointer), true);
                        panelEl.addEventListener('pointerdown', () => queueMicrotask(clearActiveOnPointer), true);

                        const selectionSub = this.multiSelectDropdown.optionSelectionChanges.subscribe(() => {
                            queueMicrotask(() => clearActiveOnPointer());
                        });

                        const docCaptureKeydown = (ev: KeyboardEvent) => {
                            if (ev.key === 'Tab') {
                                const target = ev.target as Node | null;
                                if (target && panel.contains(target)) {
                                    XcFormAutocompleteComponent.closeAllDropdowns$.next(this);
                                    this.multiSelectDropdown.close();
                                }
                            }
                        };
                        document.addEventListener('keydown', docCaptureKeydown, true);

                        const sub = this.multiSelectDropdown.openedChange.subscribe((o) => {
                            if (!o) {
                                panel.removeEventListener('keydown', this.boundPanelKeydown, { capture: true });
                                panelEl.removeEventListener('click', () => queueMicrotask(clearActiveOnPointer), true);
                                panelEl.removeEventListener('pointerdown', () => queueMicrotask(clearActiveOnPointer), true);
                                document.removeEventListener('keydown', docCaptureKeydown, true);
                                selectionSub?.unsubscribe();
                                sub.unsubscribe();
                            }
                        });

                        queueMicrotask(() => clearActiveVisuals(panelEl));
                        requestAnimationFrame(() => clearActiveVisuals(panelEl));
                        setTimeout(() => clearActiveVisuals(panelEl), 0);
                    }

                    this.panelFocusInListener = (ev: FocusEvent) => {
                        const target = ev.target as Node | null;
                        if (!panel) return;
                        if (
                            target &&
                            !panel.contains(target) &&
                            !this.elementRef.nativeElement.contains(target)
                        ) {
                            if (this.multiSelectDropdown.panelOpen) {
                                XcFormAutocompleteComponent.closeAllDropdowns$.next(this);
                                this.multiSelectDropdown.close();
                            }
                        }
                    };
                    document.addEventListener('focusin', this.panelFocusInListener);
                } else {
                    if (panel) {
                        panel.removeEventListener('keydown', this.boundPanelKeydown);
                    }
                    if (this.panelFocusInListener) {
                        document.removeEventListener('focusin', this.panelFocusInListener);
                        this.panelFocusInListener = undefined;
                    }
                }
            });
        }
        this.updateFilteredOptions.next(this.selectedOption);
        this.cdRef.detectChanges();
    }


    ngOnDestroy() {
        // remove subscription
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        if (this.closeAllSub) {
            this.closeAllSub.unsubscribe();
        }

        const element = this.elementRef.nativeElement as HTMLElement;
        this.ngZone.runOutsideAngular(() => {
            element.removeEventListener("keydown", this.onkeydown);
            element.removeEventListener("keyup", this.keyup);
        });
        const panel = this.multiSelectDropdown?.panel?.nativeElement as HTMLElement | undefined;
            if (panel) {
                panel.removeEventListener("keydown", this.boundPanelKeydown);
            }
            if (this.panelFocusInListener) {
                document.removeEventListener(
                    "focusin",
                    this.panelFocusInListener,
                );
            }
        document.removeEventListener("focusin", this.onDocumentFocusIn, true);
        document.removeEventListener("mousedown", this.onDocumentMouseDown,true);
    }


    private readonly onScrollIfAutocompleteIsOpen = (event: Event) => {
        // Chrome on Windows triggers a scroll event if the browser needs to render a too big of a text into an input element
        // in this event, the event's target is the input element itself
        const targetIsInputElement = (event.target as HTMLElement).getAttribute ? ((event.target as HTMLElement).getAttribute('id') === this.input.id) : false;
        const targetIsOptionBox = this.trigger.autocomplete.panel ? event.target === this.trigger.autocomplete.panel.nativeElement : false;
        if (this.trigger.panelOpen && !targetIsInputElement && !targetIsOptionBox) {
            this.trigger.closePanel();
        }
    };


    private boundPanelKeydown = (ev: KeyboardEvent) => {
        if (!this.multiSelect) return;

        // Swallow the first ArrowDown/Up after a keyboard-initiated open
        if (this.msSwallowNextNav && (ev.key === 'ArrowDown' || ev.key === 'ArrowUp')) {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            this.msSwallowNextNav = false;

            const kmAny: any = (this.multiSelectDropdown)._keyManager || this.multiKeyManager;
            if (kmAny) {
                try { kmAny.setActiveItem(-1); } catch { kmAny._activeItemIndex = -1; }
            }

            // Clear any residual active visuals and aria
            const panel = this.multiSelectDropdown.panel?.nativeElement as HTMLElement | undefined;
            panel?.querySelectorAll('.mat-option.mat-active,.mat-mdc-option.mdc-list-item--activated,.mat-mdc-option.mat-mdc-option-active')
                ?.forEach(el => el.classList.remove('mat-active', 'mdc-list-item--activated', 'mat-mdc-option-active'));
            const listbox = panel?.querySelector('[role="listbox"]') as HTMLElement | null;
            listbox?.removeAttribute('aria-activedescendant');
            return;
        }

        // Reset guards on close/navigation away
        if (ev.key === 'Escape' || ev.key === 'Tab') {
            this.msSwallowNextNav = false;
        }
    };

    protected suffixClickChangedValue(unfocusedInput: boolean) {
        this.suppressNextFocusEmit = unfocusedInput;
        super.suffixClickChangedValue(unfocusedInput);
        this.checkValue();
        this.updateFilteredOptions.next(this.selectedOption);
        this.trigger.openPanel();
    }


    protected checkValue() {
        let option: any;

        // value is a string?
        if (isString(this.value)) {
            // append new option as a fallback, if autocomplete is used as input
            const options = this.asInput
                ? (this.options ?? []).concat(XcOptionItemString(this.value))
                : (this.options ?? []);
            // find option with matching name with consideration of case sensitivity
            option = options.find(o => !o.disabled && (
                (this.caseSensitive && o.name === this.value) ||
                (!this.caseSensitive && o.name.toLowerCase() === this.value.toLowerCase())
            ));
        } else {
            // use value, if it's an option
            option = isObject(this.value) ? this.value : undefined;
        }

        // restore selected option, if it's already selected
        if (this.value && option === this.selectedOption) {
            this.value = this.selectedOption;
        } else {
            // otherwise select new option
            this.select(option);
        }
    }


    protected sort(options: XcOptionItem[]) {
        return (this._sortDirection !== XcSortDirection.none)
            ? options.sort(XcSortPredicate(this._sortDirection, this.caseSensitive ? option => option.name : option => option.name.toLowerCase()))
            : options;
    }


    protected copy(): XcOptionItem[] {
        return this.options
            ? this.options.slice()
            : [];
    }


    protected filter(string: string): XcOptionItem[] {
        const result = this.options || [];
        if (!this.asDropdown) {
            return result.filter(option => {
                const optionName = this.caseSensitive ? this.optionName(option) : this.optionName(option).toLowerCase();
                const other = this.caseSensitive ? string : string.toLowerCase();
                return this.fullTextSearch
                    ? optionName.indexOf(other) >= 0
                    : optionName.startsWith(other);
            });
        }
        return result;
    }


    protected setActiveItem(idx: number) {
        this.trigger.autocomplete._keyManager.setActiveItem(idx);
    }


    protected select(value?: XcOptionItem) {
        if (this.selectedOption !== value) {
            this.option = value;
            this.optionChange.emit(value);
            this.cdRef.detectChanges();
        }
    }


    mousedown(event: MouseEvent) {
        if (!this.readonly && !this.disabled) {
            event.preventDefault();

            if (this.trigger)
                (this.trigger).autocompleteDisabled = false;

            if (this.enteredFromOutsideCooldown) {
                this.clearEnteredCooldownAndBlocks();
            }

            if (!this.hasUserInteracted) {
                this.hasUserInteracted = true;
                this.allowOpenAfterTick();
            }
            if (this.multiSelect && !this.hasSelectUserInteracted) {
                this.hasSelectUserInteracted = true;
                this.allowSelectOpenAfterTick();
            }

            if (
                this.blockFirstOpen ||
                this.deferOpenUntilNextTick ||
                (this.multiSelect &&
                    (this.blockFirstOpenSelect ||
                        this.deferOpenSelectUntilNextTick))
            ) {
                this.cdRef.detectChanges();
                return;
            }

            if (this.multiSelect) {
                if (this.multiSelectDropdown) {
                    if (this.multiSelectDropdown.panelOpen) {
                        this.multiSelectDropdown.close();
                    } else {
                        XcFormAutocompleteComponent.closeAllDropdowns$.next(
                            this,
                        );
                        (this.multiSelectDropdown).open();
                    }
                }
            } else if (this.asDropdown) {
                if (this.trigger?.panelOpen) {
                    this.trigger.closePanel();
                } else {
                    (this.trigger).openPanel();
                }
            } else {
                (this.trigger).openPanel();
            }
            this.cdRef.detectChanges();
        }
    }

    suffixMouseDown(event: MouseEvent) {
        super.suffixMouseDown(event);
        this.mousedown(event);
    }


    onkeydown = (event: KeyboardEvent) => {

        if (event.key === "Tab") {
            // If multiselect is open, close it before tabbing away.
            if (this.multiSelect && this.multiSelectDropdown?.panelOpen) {
                XcFormAutocompleteComponent.closeAllDropdowns$.next(this);
                this.multiSelectDropdown.close();
            }
            return;
        }

        if (this.trigger) (this.trigger).autocompleteDisabled = false;

        if (!this.hasUserInteracted) {
            this.hasUserInteracted = true;
            this.allowOpenAfterTick();
        }

        if (this.multiSelect && !this.hasSelectUserInteracted) {
            this.hasSelectUserInteracted = true;
            this.allowSelectOpenAfterTick();
        }

        if (!this.multiSelect || !this.multiSelectDropdown) {
            if (event.key === "ArrowDown") {
                if (this.trigger && !this.trigger.panelOpen) {
                    if (this.enteredFromOutsideCooldown) {
                        this.clearEnteredCooldownAndBlocks();
                    }

                    this.trigger.openPanel();
                    event.preventDefault();
                    return;
                }
            }
            this.ngZone.run(() => super.onkeydown(event));
            return;
        }

        switch (event.key) {
            case 'ArrowDown': {
                if (this.enteredFromOutsideCooldown) {
                    this.clearEnteredCooldownAndBlocks();
                }

                // Open panel without activating any option; swallow first nav after keyboard-open
                if (
                    !this.multiSelectDropdown.panelOpen &&
                    !this.blockFirstOpenSelect &&
                    !this.deferOpenSelectUntilNextTick
                ) {
                    XcFormAutocompleteComponent.closeAllDropdowns$.next(this);
                    this.msSwallowNextNav = true;
                    (this.multiSelectDropdown).open();

                    // Keep active index at -1 (no active row)
                    const kmAny: any = (this.multiSelectDropdown)._keyManager || this.multiKeyManager;
                    if (kmAny) {
                        try { kmAny.setActiveItem(-1); } catch { kmAny._activeItemIndex = -1; }
                    }

                    // Extra visual cleanup passes (legacy + MDC + aria)
                    const panel = this.multiSelectDropdown.panel?.nativeElement as HTMLElement | undefined;
                    const clear = () => {
                        panel?.querySelectorAll('.mat-option.mat-active,.mat-mdc-option.mdc-list-item--activated,.mat-mdc-option.mat-mdc-option-active')
                            ?.forEach(el => el.classList.remove('mat-active', 'mdc-list-item--activated', 'mat-mdc-option-active'));
                        const listbox = panel?.querySelector('[role="listbox"]') as HTMLElement | null;
                        listbox?.removeAttribute('aria-activedescendant');
                    };
                    queueMicrotask(clear);
                    requestAnimationFrame(clear);
                    setTimeout(clear, 0);

                    // Consume the key so it doesn't also navigate
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return;
                }

                // Panel already open: normal navigation
                const km = (this.multiSelectDropdown)._keyManager || this.multiKeyManager;
                if (km) {
                    km.setNextItemActive();
                    this.cdRef.detectChanges();

                    const activeOption = km.activeItem as MatOption | undefined;
                    const hostEl = activeOption?._getHostElement?.();
                    if (hostEl) {
                        requestAnimationFrame(() => {
                            const panel = this.multiSelectDropdown.panel?.nativeElement as HTMLElement;
                            if (panel) {
                                const panelRect = panel.getBoundingClientRect();
                                const optionRect = hostEl.getBoundingClientRect();
                                const buffer = hostEl.offsetHeight * 2;

                                if (optionRect.bottom > panelRect.bottom - buffer) {
                                    panel.scrollTop += optionRect.bottom - panelRect.bottom + buffer;
                                } else if (optionRect.top < panelRect.top + buffer) {
                                    panel.scrollTop -= panelRect.top - optionRect.top + buffer;
                                }
                            } else {
                                hostEl.scrollIntoView({ block: 'nearest' });
                            }
                        });
                    }
                }

                event.preventDefault();
                break;
            }

            case "ArrowUp": {
                if (this.multiSelectDropdown.panelOpen) {
                    const km =
                        (this.multiSelectDropdown)._keyManager ||
                        this.multiKeyManager;
                    if (km) {
                        km.setPreviousItemActive();
                        this.cdRef.detectChanges();

                        const activeOption = km.activeItem as
                            | MatOption
                            | undefined;
                        const hostEl = activeOption?._getHostElement?.();
                        if (hostEl) {
                            requestAnimationFrame(() => {
                                const panel = this.multiSelectDropdown.panel
                                    ?.nativeElement as HTMLElement;
                                if (panel) {
                                    const panelRect =
                                        panel.getBoundingClientRect();
                                    const optionRect =
                                        hostEl.getBoundingClientRect();
                                    const buffer = hostEl.offsetHeight * 2;

                                    if (
                                        optionRect.bottom >
                                        panelRect.bottom - buffer
                                    ) {
                                        panel.scrollTop +=
                                            optionRect.bottom -
                                            panelRect.bottom +
                                            buffer;
                                    } else if (
                                        optionRect.top <
                                        panelRect.top + buffer
                                    ) {
                                        panel.scrollTop -=
                                            panelRect.top -
                                            optionRect.top +
                                            buffer;
                                    }
                                } else {
                                    hostEl.scrollIntoView({ block: "nearest" });
                                }
                            });
                        }
                    }
                    event.preventDefault();
                }
                break;
            }

            case " ":
            case "Spacebar":
                if (
                    this.multiSelectDropdown.panelOpen &&
                    this.multiKeyManager
                ) {
                    const activeOption = this.multiKeyManager.activeItem;
                    activeOption?._selectViaInteraction?.();
                    event.preventDefault();
                }
                break;

            case "Enter":
                if (this.multiSelectDropdown.panelOpen) {
                    this.applyMultiSelect();
                    event.preventDefault();
                    event.stopPropagation();
                }
                break;

            case "Escape":
                if (this.multiSelectDropdown.panelOpen) {
                    this.cancelMultiSelect();
                    event.preventDefault();
                    event.stopPropagation();
                }
                break;

            default:
                // should run in Angular's zone to avoid compatible problems
                this.ngZone.run(() => super.onkeydown(event));
        }
    };


    keyup = (event: KeyboardEvent) => {

        // trigger's panel is closed beforehand if user presses Enter
        // - therefore this.trigger.panelOpen is a bad indicator for checking if the panel was open
        const panelWasOpen = this.openPanelWasJustClosed;
        this.openPanelWasJustClosed = false;

        if (panelWasOpen && event.key === 'Escape' || event.key === 'Enter') {
            event.stopPropagation();
        }

        // fixes bug which sometimes caused the panel to be closed after clearing the input all at once
        // (via CTRL+BACKSPACE / CTRL+DELETE or, with the input's text being selected, via CTRL+X / BACKSPACE / DELETE)
        // not opening if tabbed to, while pressing "Tab" or "Tab + Shift"
        // const notAllowed = ['Enter', 'Escape', 'Tab', 'Shift'];
        // if (!this.trigger.panelOpen && !this.input.value && !notAllowed.includes(event.key)) {
        //     this.value = undefined;
        //     this.trigger.openPanel();
        // }
        this.cdRef.detectChanges();
    };


    onfocus(event: FocusEvent) {
        this.cdRef.detectChanges();

        // suppress focus emit, if necessary
        if (!this.suppressNextFocusEmit) {
            this.focus.emit(event);
        }
        this.suppressNextFocusEmit = false;

        // the autocomplete is being disabled and therefore the trigger won't auto-opening the panel as it would usually do
        this.trigger.autocompleteDisabled = true;
        setTimeout(() => this.trigger.autocompleteDisabled = false, 0);

        // TODO FIXME - it must be possible to prevent the MatAutocompleteTrigger's auto opening of the panel on focus
        // if so, we could get rid of the following a11y service method
        const txt = this.a11yFocusLine || (this.label + ' '
            + this.i18nService.translate(this.asDropdown
                ? XcFormAutocompleteComponent.globalDropdownA11yFocusLine
                : XcFormAutocompleteComponent.globalAutocompleteA11yFocusLine));
        this.a11yService.screenreaderSpeak(txt);
    }


    onblur(event: FocusEvent) {
        // suppress next focus emit, after clicking an option (which refocuses the input)
        if (event.relatedTarget instanceof HTMLElement) {
            this.suppressNextFocusEmit = event.relatedTarget.classList.contains('mat-option');
        }
        // click on disabled options should not unfocus input field!
        if (event.relatedTarget instanceof HTMLElement && event.relatedTarget.classList.contains('mat-option-disabled')) {
            this.setFocus();
        } else {
            // fixes weird bug where autocomplete would not close when focusing an input or button afterwards
            if (event.relatedTarget instanceof HTMLInputElement || event.relatedTarget instanceof HTMLButtonElement) {
                this.trigger.closePanel();
                // check value for actions within focusing event
                this.checkValue();
            }
            this.cdRef.detectChanges();
            this.blur.emit(event);
        }
    }


    @Input('xc-form-autocomplete-asinput')
    set asInput(value: boolean) {
        this._asInput = coerceBoolean(value);
    }


    get asInput(): boolean {
        return this._asInput;
    }


    @HostBinding('class.as-dropdown')
    @Input('xc-form-autocomplete-asdropdown')
    set asDropdown(value: boolean) {
        this._asDropdown = coerceBoolean(value);
        if (this.asDropdown) {
            this.suffix = 'dropdown';
        }
    }


    get asDropdown(): boolean {
        return this._asDropdown;
    }


    @Input('xc-form-autocomplete-casesensitive')
    set caseSensitive(value: boolean) {
        this._caseSensitive = coerceBoolean(value);
    }


    get caseSensitive(): boolean {
        return this._caseSensitive;
    }


    @Input('xc-form-autocomplete-fulltextsearch')
    set fullTextSearch(value: boolean) {
        this._fullTextSearch = coerceBoolean(value);
    }


    get fullTextSearch(): boolean {
        return this._fullTextSearch;
    }


    @Input('xc-form-autocomplete-option')
    set option(value: XcOptionItem) {
        this.selectedOption = value;
        this.value = value;
    }


    get option(): XcOptionItem {
        return this.selectedOption;
    }


    @Input('xc-form-autocomplete-options')
    set options(value: XcOptionItem[]) {
        this._options = value as XcOptionInternalAutocompleteItem[];
        this.updateFilteredOptions.next(this.selectedOption ?? this.value);
    }


    get options(): XcOptionItem[] {
        return this._options;
    }


    @Input('xc-form-autocomplete-sortdirection')
    set sortDirection(value: string) {
        this._sortDirection = XcSortDirectionFromString(value);
        this.updateFilteredOptions.next(this.selectedOption);
    }


    get sortDirection(): string {
        return XcSortDirection[this._sortDirection];
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
        return this.trigger?.activeOption?.value;
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
        if (!this.asInput) {
            this.setActiveItem(Math.max(this.selectedIdx, 0) || this.enabledIdx);
        }
        this.selectedIdxResettable = false;
        // emit event
        this.optionsOpened.emit();
        this.cdRef.detectChanges();

        // decide, if tooltip is needed
        // ----------------------------

        // getting the listbox, in which all option elements are
        const listbox = document.body.querySelector('#' + this.trigger.autocomplete.id);

        Array.from(listbox.children).forEach((matOptionElement: HTMLElement) => {
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
                            const option = this.options.find(op => op.name === childNode.nodeValue) as XcOptionInternalAutocompleteItem;
                            if (option) {

                                const isOverflowing = isTextOverflowing(childNode.parentElement, option.name);

                                // is there change
                                if (!!option.showTooltip !== isOverflowing) {
                                    option.showTooltip = isOverflowing;
                                    this.cdRef.detectChanges();
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
        this.cdRef.detectChanges();
        this.openPanelWasJustClosed = true;
    }


    optionName(option: XcOptionItem): string {
        return option ? option.name : '';
    }


    selectedOptionsMulti: XcOptionItem[] = [];
    private _filterMultiSelect = false;
    filteredMultiSelectOptions: XcOptionItem[] = [];

    @ViewChild("multiSelectDropdown", { static: false })
    multiSelectDropdown: MatSelect;
    multiSelectControl = new FormControl<string[]>([]);
    multiSelectInputControl = new FormControl("");
    private tempMultiSelect: string[] = [];
    private lastAppliedMultiSelect: string[] = [];

    @Input("xc-form-autocomplete-asmultiselect")
    set multiSelect(value: boolean) {
        this._filterMultiSelect = coerceBoolean(value);
    }

    @Input("xc-form-autocomplete-reset")
    set reset(value: boolean) {
        if (coerceBoolean(value)) {
            this.value = false;
            setTimeout(() => {
                this.resetMultiselectCheckboxes();
                this.cdRef.detectChanges();
            });
        }
    }


    get multiSelect(): boolean {
        return this._filterMultiSelect;
    }


    removeSelectedItem(item: XcOptionItem) {
        this.selectedOptionsMulti = this.selectedOptionsMulti.filter((i) => i.value !== item.value);
        const joinedName = this.selectedOptionsMulti.map((opt) => opt.name).join(" | ");
        const joinedValue = this.selectedOptionsMulti.map((opt) => opt.value).join(" | ");
        const combinedOption: XcOptionItem = {
            name: joinedName,
            value: joinedValue,
        };
        this.selectedOption = combinedOption;
        this.value = combinedOption;
        this.optionChange.emit(combinedOption);

        this.cdRef.detectChanges();
    }

    isOptionSelected(option: XcOptionItem): boolean {
        return this.selectedOptionsMulti?.some((o) => o.value === option.value);
    }


    ngOnInit() {
        if (this.multiSelect) {
            this.filteredMultiSelectOptions = (this.options || []).filter(o => !this.isAll(o));
            this.multiSelectInputControl.valueChanges.subscribe(val => {
                const q = (val || '').toLowerCase();
                this.filteredMultiSelectOptions = (this.options || [])
                    .filter(o => !this.isAll(o))
                    .filter(o => o.name.toLowerCase().includes(q));
            });
            this.lastAppliedMultiSelect = this.multiSelectControl.value ? [...this.multiSelectControl.value] : [];
        }
    }


    getMultiSelectedNames(): string {
        const values = Array.isArray(this.multiSelectControl.value)
            ? this.multiSelectControl.value
            : [];
        return values
            .map((val) => {
                const found = this.options.find((opt) => opt.value === val);
                return found ? found.name : "";
            })
            .filter(Boolean)
            .join(" | ");
    }


    openMultiSelectDropdown() {
        if (this.multiSelectDropdown && !this.multiSelectDropdown.disabled) {
            this.multiSelectDropdown.open();
        }
    }

    onMultiSelectOpened(opened: boolean) {
        if (opened) {
            this.tempMultiSelect = [...(this.multiSelectControl.value || [])];
        } else {
            // If closed without clicking Apply, restore last applied values
            this.multiSelectControl.setValue([...this.lastAppliedMultiSelect]);
            this.multiSelectInputControl.setValue("");
            this.filteredMultiSelectOptions = (this.options || []).filter(o => !this.isAll(o));
        }
    }

    private isAll(opt?: XcOptionItem): boolean {
        const ALL = XcFormAutocompleteComponent.ALL_VALUE;
        const val = (opt?.value ?? '');

        // Treat as "All" if:
        // - special ALL value (null), or
        // - label equals localized "alle" (with/without <>), or
        // - injected blank option (empty name or empty value)
        return val === ALL || val === '';
    }

    applyMultiSelect() {
        const selectedValues: string[] = Array.isArray(this.multiSelectControl.value)? this.multiSelectControl.value : [];
        const joinedNames = selectedValues
            .map((val) => {
                const found = this.options.find((opt) => opt.value === val);
                return found ? found.name : "";
            }).filter(Boolean).join(" | ");
        const joinedValue = selectedValues.join("|");
        this.optionChange.emit({ name: joinedNames, value: joinedValue });
        // Store applied values
        this.lastAppliedMultiSelect = [...selectedValues];
        if (this.multiSelectDropdown) {
            this.multiSelectDropdown.close();
        }
    }

    cancelMultiSelect() {
        // Restore previous selection
        this.multiSelectControl.setValue([...this.lastAppliedMultiSelect]);
        this.multiSelectInputControl.setValue("");
        this.filteredMultiSelectOptions = (this.options || []).filter(o => !this.isAll(o));
        if (this.multiSelectDropdown) {
            this.multiSelectDropdown.close();
        }
    }

    resetMultiselectCheckboxes(): void {
        this.multiSelectControl?.setValue([]);
        this.multiSelectInputControl.setValue("");
        this.filteredMultiSelectOptions = (this.options || []).filter(o => !this.isAll(o));
        this.lastAppliedMultiSelect = [];
        this.multiSelectDropdown?.options.forEach((option) =>
            option.deselect(),
        );
    }


    private allowOpenAfterTick() {
        this.deferOpenUntilNextTick = true;
        Promise.resolve().then(() => {
            this.deferOpenUntilNextTick = false;
            this.blockFirstOpen = false;
            if (this.trigger)
                (this.trigger).autocompleteDisabled = false;
        });
    }


    private allowSelectOpenAfterTick() {
        this.deferOpenSelectUntilNextTick = true;
        Promise.resolve().then(() => {
            this.deferOpenSelectUntilNextTick = false;
            this.blockFirstOpenSelect = false;
        });
    }


    private isEventInsideAutocompletePanel(target: Node | null): boolean {
        const panelEl = this.trigger?.autocomplete?.panel?.nativeElement as
            | HTMLElement
            | undefined;
        return !!(panelEl && target && panelEl.contains(target));
    }

    private clearEnteredCooldownAndBlocks() {
        this.enteredFromOutsideCooldown = false;
        this.blockFirstOpen = false;
        this.blockFirstOpenSelect = false;
        this.deferOpenUntilNextTick = false;
        this.deferOpenSelectUntilNextTick = false;
    }

    onFieldClick(ev: MouseEvent) {
        if (this.readonly || this.disabled) return;
        const inFooter = (ev.target as HTMLElement).closest(".multiselect-actions",);
        if (inFooter) return;
        this.clearEnteredCooldownAndBlocks();
        XcFormAutocompleteComponent.closeAllDropdowns$.next(this);
        if ((this.multiSelectDropdown).toggle) {
            (this.multiSelectDropdown).toggle();
        } else {
            (this.multiSelectDropdown).open();
        }
    }

    private onDocumentFocusIn = (ev: FocusEvent) => {
        const root = this.elementRef.nativeElement as HTMLElement;
        const target = ev.target as Node | null;
        if (this.isEventInsideAutocompletePanel(target)) {
            return; // allow mat-option clicks to proceed
        }
        if (target && !root.contains(target)) {
            if (this.trigger?.panelOpen) this.trigger.closePanel();
            // Do NOT set autocompleteDisabled/block flags for autocomplete here
            this.blockFirstOpen = true;
            this.blockFirstOpenSelect = true;
            this.enteredFromOutsideCooldown = true;
        }
    };

    private onDocumentMouseDown = (ev: MouseEvent) => {
        const root = this.elementRef.nativeElement as HTMLElement;
        const target = ev.target as Node | null;
        if (this.isEventInsideAutocompletePanel(target)) {
            return; // allow mat-option clicks to select
        }
        if (target && !root.contains(target)) {
            if (this.trigger?.panelOpen) this.trigger.closePanel();
            // Do NOT set autocompleteDisabled/block flags for autocomplete here
            this.blockFirstOpen = true;
            this.blockFirstOpenSelect = true;
            this.enteredFromOutsideCooldown = true;
        }
    };
}
