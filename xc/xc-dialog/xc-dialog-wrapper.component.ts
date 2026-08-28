import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, Output, Renderer2, signal, viewChild } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

import { coerceBoolean } from '../../base';
import { XcDragDirective, XcDragOptions } from '../shared/xc-drag.directive';
import { XcResizeDirective, XcResizeOptions } from '../shared/xc-resize.directive';
import { XcIconButtonComponent } from '../xc-button/xc-icon-button.component';


export enum XcDialogPositions {
    CENTER = 'center',
    NORDWEST = 'nordwest',
    NORDEAST = 'nordeast',
    SOUTHEAST = 'southeast',
    SOUTHWEST = 'southwest'
}


export interface XcDialogOptions {
    dragOptions?: XcDragOptions;
    resizeOptions?: XcResizeOptions;
    initialHeight?: string;
    initialWidth?: string;
    position?: XcDialogPositions;
}


@Component({
    selector: 'xc-dialog-wrapper',
    templateUrl: './xc-dialog-wrapper.component.html',
    styleUrls: ['./xc-dialog-wrapper.component.scss'],
    imports: [NgClass, XcResizeDirective, XcDragDirective, MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, XcIconButtonComponent]
})
export class XcDialogWrapperComponent implements AfterViewInit {
    protected readonly renderer = inject(Renderer2);
    private readonly element = inject(ElementRef);


    private readonly draggableState = signal(false);
    private readonly resizableState = signal(false);
    private readonly maximizedState = signal(false);
    private readonly maximizableState = signal(false);
    private readonly dialogOptionsState = signal<XcDialogOptions>({});

    @Input({transform: coerceBoolean})
    set draggable(value: boolean) {
        this.draggableState.set(value);
    }

    get draggable(): boolean {
        return this.draggableState();
    }

    @Input({transform: coerceBoolean})
    set resizable(value: boolean) {
        this.resizableState.set(value);
        this.element.nativeElement.style.setProperty('--resizable', value);
    }

    get resizable(): boolean {
        return this.resizableState();
    }

    @Input({transform: coerceBoolean})
    set maximized(value: boolean) {
        this.maximizedState.set(value);

        if (this.dialogRoot()) {
            this.applyMaximizedState();
        }

        this.maximizedChange.emit(this.maximizedState());
    }

    get maximized(): boolean {
        return this.maximizedState();
    }

    @Input({transform: coerceBoolean})
    set maximizable(value: boolean) {
        this.maximizableState.set(value);
    }

    get maximizable(): boolean {
        return this.maximizableState();
    }

    @Input('xc-dialog-options')
    set dialogOptions(value: XcDialogOptions) {
        if (value) {
            const dragOptions: XcDragOptions = {
                dragX: coerceBoolean(value.dragOptions?.dragX),
                dragY: coerceBoolean(value.dragOptions?.dragY),
                dragInViewport: coerceBoolean(value.dragOptions?.dragInViewport)
            };
            const resizeOptions: XcResizeOptions = {
                all: coerceBoolean(value.resizeOptions?.all),
                south: coerceBoolean(value.resizeOptions?.south),
                east: coerceBoolean(value.resizeOptions?.east),
                southEast: coerceBoolean(value.resizeOptions?.southEast),
                southWest: coerceBoolean(value.resizeOptions?.southWest),
                west: coerceBoolean(value.resizeOptions?.west),
                northWest: coerceBoolean(value.resizeOptions?.northWest),
                north: coerceBoolean(value.resizeOptions?.north),
                northEast: coerceBoolean(value.resizeOptions?.northEast),
                resizeInViewport: coerceBoolean(value.resizeOptions?.resizeInViewport),
                minHeight: value.resizeOptions?.minHeight,
                minWidth: value.resizeOptions?.minWidth,
                maxHeight: value.resizeOptions?.maxHeight,
                maxWidth: value.resizeOptions?.maxWidth
            };
            this.dialogOptionsState.set({
                dragOptions,
                resizeOptions,
                initialHeight: value.initialHeight,
                initialWidth: value.initialWidth,
                position: value.position
            });
        } else {
            this.dialogOptionsState.set({});
        }
    }

    get dialogOptions(): XcDialogOptions {
        return this.dialogOptionsState();
    }

    @Output()
    maximizedChange = new EventEmitter<boolean>();


    readonly dialogRoot = viewChild<ElementRef>('dialogRoot');

    dragEventTarget: MouseEvent | TouchEvent;

    constructor() {
        this.element.nativeElement.style.setProperty('--resizable', this.resizable);
    }

    ngAfterViewInit() {
        this.center();

        if (this.maximized) {
            this.applyMaximizedState();
        }
    }

    private _preMaximize = {
        top: 0,
        left: 0,
        width: 0,
        height: 0
    };

    center() {
        const dialogRoot = this.dialogRoot();
        if (dialogRoot) {
            this.renderer.setStyle(dialogRoot.nativeElement, 'height', this.dialogOptions.initialHeight ? this.dialogOptions.initialHeight : 'unset');
            this.renderer.setStyle(dialogRoot.nativeElement, 'width', this.dialogOptions.initialWidth ? this.dialogOptions.initialWidth : 'unset');
            const elementWidth = dialogRoot.nativeElement.offsetWidth;
            const elementHeight = dialogRoot.nativeElement.offsetHeight;
            this.renderer.setStyle(dialogRoot.nativeElement, 'height', this.dialogOptions.initialHeight ? this.dialogOptions.initialHeight : elementHeight > window.innerHeight ? '80vh' : 'auto');
            this.renderer.setStyle(dialogRoot.nativeElement, 'width', this.dialogOptions.initialWidth ? this.dialogOptions.initialWidth : elementWidth > window.innerWidth ? '80vw' : 'auto');
            this.setPosition();
        }
    }

    setPosition() {
        const elementWidth = this.dialogRoot().nativeElement.offsetWidth;
        const elementHeight = this.dialogRoot().nativeElement.offsetHeight;
        let left: number;
        let top: number;
        switch (this.dialogOptions.position) {
            case XcDialogPositions.CENTER:
                left = Math.max((window.innerWidth - elementWidth) / 2, 0);
                top = Math.max((window.innerHeight - elementHeight) / 2, 0);
                break;
            case XcDialogPositions.NORDWEST:
                left = 0;
                top = 0;
                break;
            case XcDialogPositions.NORDEAST:
                left = window.innerWidth - elementWidth;
                top = 0;
                break;
            case XcDialogPositions.SOUTHEAST:
                left = window.innerWidth - elementWidth;
                top = window.innerHeight - elementHeight;
                break;
            case XcDialogPositions.SOUTHWEST:
                left = 0;
                top = window.innerHeight - elementHeight;
                break;
            default:
                left = Math.max((window.innerWidth - elementWidth) / 2, 0);
                top = Math.max((window.innerHeight - elementHeight) / 2, 0);
        }

        const dialogRoot = this.dialogRoot();
        this.renderer.setStyle(dialogRoot.nativeElement, 'left', left + 'px');
        this.renderer.setStyle(dialogRoot.nativeElement, 'top', top + 'px');
    }

    initDrag(event: MouseEvent | TouchEvent) {
        this.dragEventTarget = event;
    }


    private applyMaximizedState() {
        const dialogRoot = this.dialogRoot();
        if (!dialogRoot) return;

        const el = dialogRoot.nativeElement;

        if (this.maximized) {
            // speichern
            this._preMaximize.top = parseFloat(el.style.top) || 0;
            this._preMaximize.left = parseFloat(el.style.left) || 0;
            this._preMaximize.width = el.offsetWidth;
            this._preMaximize.height = el.offsetHeight;

            // fullscreen
            this.renderer.setStyle(el, 'top', '0px');
            this.renderer.setStyle(el, 'left', '0px');
            this.renderer.setStyle(el, 'width', '100vw');
            this.renderer.setStyle(el, 'height', '100vh');
        } else {
            // restore
            this.renderer.setStyle(el, 'top', this._preMaximize.top + 'px');
            this.renderer.setStyle(el, 'left', this._preMaximize.left + 'px');
            this.renderer.setStyle(el, 'width', this._preMaximize.width + 'px');
            this.renderer.setStyle(el, 'height', this._preMaximize.height + 'px');
        }
    }


    toggleMaximize(event: Event) {
        this.maximized = !this.maximized;
        event.preventDefault();
    }
}
