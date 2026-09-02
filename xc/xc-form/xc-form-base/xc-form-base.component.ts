import { AfterContentInit, Component, computed, effect, ElementRef, HostBinding, inject, Input, signal, output } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';

import { coerceBoolean } from '../../../base';
import { I18nService, LocaleService } from '../../../i18n';
import { xcFormTranslations_deDE } from '../locale/xc-translations.de-DE';
import { xcFormTranslations_enUS } from '../locale/xc-translations.en-US';


export enum FloatStyle {
    auto = 'auto',
    always = 'always'
}

type ErrorMessageCase = 'none' | 'uppercase' | 'lowercase' | 'capitalize';


const normalizeErrorMessageCase = (value: string): ErrorMessageCase => {
    switch (value?.toLowerCase()) {
        case 'uppercase':
            return 'uppercase';
        case 'lowercase':
            return 'lowercase';
        case 'capitalize':
            return 'capitalize';
        default:
            return 'none';
    }
};


@Component({
    template: '',
})
export class XcFormComponent implements AfterContentInit {
    protected readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
    protected readonly i18n = inject(I18nService);
    protected readonly localeService = inject(LocaleService);
    protected readonly compactState = signal(false);
    protected readonly semiCompactState = signal(false);
    protected readonly indicateChangesState = signal(false);
    protected readonly readonlyState = signal(false);
    private readonly labelState = signal('');
    protected readonly floatLabelInputState = signal<FloatLabelType>('always');
    protected readonly iconTooltipInputState = signal('');
    protected readonly ariaLabelInputState = signal('');
    protected readonly compactInputState = signal(false);
    protected readonly indicateChangesInputState = signal(false);
    protected readonly disabledInputState = signal(false);
    protected readonly readonlyInputState = signal(false);
    protected readonly placeholderInputState = signal('');
    protected readonly tabIndexInputState = signal<number | undefined>(0);
    protected readonly valueInputState = signal<any>(undefined);
    protected readonly errorFuncInputState = signal<((key: string, data: any) => string) | undefined>(undefined);
    protected readonly callbackInputState = signal<((component: any) => void) | undefined>(undefined);

    protected readonly i18nContextState = signal<string | undefined>(undefined);
    protected readonly labelTranslationState = computed(() => {
        this.localeService.languageSignal();
        return this.translateValue(this.labelState());
    });
    protected readonly iconTooltipTranslationState = computed(() => {
        this.localeService.languageSignal();
        return this.translateValue(this.iconTooltipInputState());
    });
    protected readonly ariaLabelTranslationState = computed(() => {
        this.localeService.languageSignal();
        return this.translateValue(this.ariaLabelInputState()) || this.labelTranslationState();
    });
    protected readonly placeholderTranslationState = computed(() => {
        this.localeService.languageSignal();
        return this.translateValue(this.placeholderInputState()) || ' ';
    });

    get floatLabel(): FloatLabelType {
        return this.floatLabelInputState();
    }

    get label(): string {
        return this.labelTranslationState();
    }


    @Input('label')
    set label(value: string) {
        this.labelState.set(value || '');
    }

    @Input('xc-form-field-floatlabel')
    set floatLabelInput(value: FloatLabelType) {
        this.floatLabelInputState.set(value || 'always');
    }

    @Input('iconTooltip')
    set iconTooltipInput(value: string) {
        this.iconTooltipInputState.set(value || '');
    }

    @Input('xc-form-field-aria-label')
    set ariaLabelInput(value: string) {
        this.ariaLabelInputState.set(value || '');
    }

    @Input('xc-form-field-compact')
    set compactInput(value: boolean) {
        this.compactInputState.set(coerceBoolean(value));
    }

    @Input('xc-form-field-indicatechanges')
    set indicateChangesInput(value: boolean) {
        this.indicateChangesInputState.set(coerceBoolean(value));
    }

    @Input('disabled')
    set disabledInput(value: boolean) {
        this.disabledInputState.set(coerceBoolean(value));
    }

    @Input('readonly')
    set readonlyInput(value: boolean) {
        this.readonlyInputState.set(coerceBoolean(value));
    }

    @Input('placeholder')
    set placeholderInput(value: string) {
        this.placeholderInputState.set(value || '');
    }

    @Input('xc-form-field-tab-index')
    set tabIndexInput(value: number | undefined) {
        this.tabIndexInputState.set(value);
    }

    @Input('value')
    set valueInput(value: any) {
        this.valueInputState.set(value);
    }

    get value(): any {
        return this.valueInputState();
    }

    set value(value: any) {
        this.valueInputState.set(value);
    }

    @Input('xc-form-field-errorfunc')
    set errorFuncInput(value: ((key: string, data: any) => string) | undefined) {
        this.errorFuncInputState.set(value);
    }

    @Input('xc-form-field-callback')
    set callbackInput(value: ((component: any) => void) | undefined) {
        this.callbackInputState.set(value);
    }

    get iconTooltip(): string {
        return this.iconTooltipTranslationState();
    }

    get ariaLabel(): string {
        return this.ariaLabelTranslationState();
    }

    @HostBinding('class.compact')
    get compact(): boolean {
        return this.compactState();
    }

    @HostBinding('class.semicompact')
    get semiCompact(): boolean {
        return this.semiCompactState();
    }

    protected get indicateChanges(): boolean {
        return this.indicateChangesState();
    }

    protected get readonly(): boolean {
        return this.readonlyState();
    }

    get tabIndex(): number | undefined {
        return this.tabIndexInputState();
    }

    get errorFunc(): ((key: string, data: any) => string) | undefined {
        return this.errorFuncInputState();
    }


    @HostBinding('class.nolabel')
    protected get _xc_nolabel(): boolean {
        return !this.label;
    }


    ngAfterContentInit() {
        this.i18nContextState.set(this.resolveI18nContext());
    }


    private resolveI18nContext(): string {
        const element = this.element.nativeElement;
        const directContext = element.getAttribute('xc-i18n-context') ?? element.getAttribute('xc-i18n');
        if (directContext !== null) {
            return directContext;
        }

        let currentElement = element.parentElement;
        while (currentElement) {
            const inheritedContext = currentElement.getAttribute('xc-i18n-context') ?? currentElement.getAttribute('xc-i18n');
            if (inheritedContext !== null) {
                return inheritedContext;
            }
            currentElement = currentElement.parentElement;
        }

        return undefined;
    }


    protected retranslateAll() {
    }


    protected translateValue(key: string): string {
        if (!key) {
            return key;
        }

        const i18nContext = this.i18nContextState();
        const contextKey = i18nContext ? i18nContext + '.' + key : key;
        const translation = this.i18n.getTranslation(contextKey);
        if (translation?.value && translation.value !== contextKey) {
            return translation.value;
        }

        const fallbackTranslation = this.i18n.getTranslation(key);
        if (fallbackTranslation?.value && fallbackTranslation.value !== key) {
            return fallbackTranslation.value;
        }

        return key;
    }
}



@Component({
    template: '',
})
export class XcFormBaseComponent extends XcFormComponent implements AfterContentInit {
    readonly formControl = new FormControl();
    private readonly explicitErrorMessageCaseState = signal<ErrorMessageCase>('none');
    private readonly inheritedErrorMessageCaseState = signal<ErrorMessageCase>('none');
    protected readonly errorMessageCaseState = computed(() => {
        const explicitCase = this.explicitErrorMessageCaseState();
        return explicitCase !== 'none' ? explicitCase : this.inheritedErrorMessageCaseState();
    });

    @Input('xc-form-field-error-message-case')
    set errorMessageCaseInput(value: string) {
        this.explicitErrorMessageCaseState.set(normalizeErrorMessageCase(value));
    }

    readonly valueChange = output<any>();

    readonly valueKeydown = output<KeyboardEvent>();

    readonly focus = output<FocusEvent>();

    readonly blur = output<FocusEvent>();

    @HostBinding('class.indicatechanges')
    get indicateChanges(): boolean {
        return super.indicateChanges;
    }


    @HostBinding('class.noerror')
    protected get _xc_noerror(): boolean {
        return !this.errorVisible;
    }

    get value(): any {
        return this.formControl.value;
    }

    set value(value: any) {
        this.formControl.setValue(value);
    }

    get disabled(): boolean {
        return this.formControl.disabled;
    }


    get readonly(): boolean {
        return super.readonly;
    }


    get placeholder(): string {
        return this.placeholderTranslationState();
    }


    get errorVisible(): boolean {
        return this.formControl.errors !== null && this.formControl.touched && !this.readonly;
    }


    get errorContent(): string {
        const errorFunc = (key: string, data: any): string => {
            switch (key) {
                case 'email': return this.i18n.translateSignal('zeta.xc-form-base.email')();
                case 'max': return this.i18n.translateSignal('zeta.xc-form-base.max')() + data.max;
                case 'min': return this.i18n.translateSignal('zeta.xc-form-base.min')() + data.min;
                case 'maxlength': return this.i18n.translateSignal('zeta.xc-form-base.maxlength')() + data.requiredLength;
                case 'minlength': return this.i18n.translateSignal('zeta.xc-form-base.minlength')() + data.requiredLength;
                case 'number': return this.i18n.translateSignal('zeta.xc-form-base.number', { key: '$0', value: (<string>data.format.toString()).toUpperCase() })();
                case 'required': return this.i18n.translateSignal('zeta.xc-form-base.required')();
                case 'pattern': return this.i18n.translateSignal('zeta.xc-form-base.pattern')() + data.requiredPattern;
                case 'ipv4': return this.i18n.translateSignal('zeta.xc-form-base.ipv4')();
                case 'ipv6': return this.i18n.translateSignal('zeta.xc-form-base.ipv6')();
                case 'ip': return this.i18n.translateSignal('zeta.xc-form-base.ip')();
                case 'message': return data.message || this.i18n.translateSignal('zeta.xc-form-base.message')();
                default: return key;
            }
        };
        return Object.keys(this.formControl.errors).map(
            key => {
                const data = this.formControl.errors[key];
                const error = this.errorFunc ? this.errorFunc(key, data) : null;
                const message = error || errorFunc(key, data);
                return this.transformErrorMessageCase(message);
            }
        ).join(', ');
    }

    constructor() {
        super();

        this.formControl.valueChanges.subscribe(value => {
            this.valueChange.emit(value);
        });

        effect(() => {
            this.localeService.languageSignal();
            this.compactState.set(this.compactInputState());
        });

        effect(() => {
            const value = this.valueInputState();
            if (this.formControl.value !== value) {
                this.formControl.setValue(value);
            }
            this.indicateChangesState.set(this.indicateChangesInputState());
            this.readonlyState.set(this.readonlyInputState());
            const disabled = this.disabledInputState();
            if (disabled) {
                this.formControl.disable({ emitEvent: false });
            } else {
                this.formControl.enable({ emitEvent: false });
            }
        });

        effect(() => {
            this.callbackInputState()?.(this);
        });

        this.i18n.setTranslations(LocaleService.EN_US, xcFormTranslations_enUS);
        this.i18n.setTranslations(LocaleService.DE_DE, xcFormTranslations_deDE);
        effect(() => {
            this.localeService.languageSignal();
            this.retranslateAll();
        });
    }


    ngAfterContentInit() {
        super.ngAfterContentInit();
        this.applyInheritedErrorMessageCase();
    }


    onkeydown(event: KeyboardEvent) {
        this.valueKeydown.emit(event);
        // stop bubbling up if someone presses the "Delete"-Key
        if (event.key === 'Delete' || event.code === 'Delete') {
            event.stopPropagation();
        }
    }


    addValidator(validator: ValidatorFn) {
        const composedValidators = Validators.compose([this.formControl.validator, validator]);
        this.formControl.setValidators(composedValidators);
    }


    protected transformErrorMessageCase(message: string): string {
        if (!message) {
            return message;
        }

        switch (this.errorMessageCaseState()) {
            case 'uppercase':
                return message.toUpperCase();
            case 'lowercase':
                return message.toLowerCase();
            case 'capitalize':
                return message
                    .toLowerCase()
                    .replace(/\b\p{L}/gu, (char: string) => char.toUpperCase());
            default:
                return message;
        }
    }


    protected applyInheritedErrorMessageCase(): void {
        if (this.errorMessageCaseState() !== 'none') {
            return;
        }
        const inheritedErrorMessageCase = this.element.nativeElement.closest('[xc-form-field-error-message-case]')
            ?.getAttribute('xc-form-field-error-message-case');
        this.inheritedErrorMessageCaseState.set(normalizeErrorMessageCase(inheritedErrorMessageCase));
    }
}
