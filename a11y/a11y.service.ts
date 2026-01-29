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
import { AriaLivePoliteness, LiveAnnouncer } from '@angular/cdk/a11y';
import { Injectable, NgZone } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';


class A11yFocusState {
    constructor(
        public previousElement: Element,
        public event: FocusEvent,
        public type: 'focus' | 'blur',
        public achieved: 'mouse' | 'keyboard'
    ) { }
}

export enum ScreenreaderPriority {
    Off = 'off',       // supported by all major screen readers
    Polite = 'polite',    // speaks, when user is not doing anything - screen reader will not interrupt - is supported by all major screen readers.
    Assertive = 'assertive' // screen reader usually interrupts the user
}


@Injectable({ providedIn: 'root' })
export class A11yService {

    private readonly focusStateSubject = new Subject<A11yFocusState>();
    readonly focusState$: Observable<A11yFocusState> = this.focusStateSubject.asObservable();

    private readonly visibilitySubject = new Subject<boolean>();
    readonly visibilityChange: Observable<boolean> = this.visibilitySubject.asObservable();

    private lastPossibleFocusChangingEventSubject = new BehaviorSubject<Event>(null);
    private lastActiveElementSubject = new BehaviorSubject<Element>(null);

    constructor(private readonly liveAnnouncer: LiveAnnouncer, private readonly ngZone: NgZone) {
        this.ngZone.runOutsideAngular(() => {
            // Sichtbarkeit
            document.addEventListener('visibilitychange', () =>
                this.ngZone.run(() => this.visibilitySubject.next(!document.hidden))
            );

            // Tastatureingabe merken
            document.addEventListener('keydown', (e: KeyboardEvent) => {
                if (e.key === 'Tab') {
                    this.lastActiveElementSubject.next(document.activeElement);
                    this.lastPossibleFocusChangingEventSubject.next(e);
                }
            });

            // Mauseingabe merken
            document.addEventListener('mousedown', (e: MouseEvent) => {
                this.lastActiveElementSubject.next(document.activeElement);
                this.lastPossibleFocusChangingEventSubject.next(e);
            });

            // Globales Fokus-Tracking (funktioniert auch bei dynamischem DOM)
            document.addEventListener('focusin', (ev: FocusEvent) => {
                this.emitFocusEvent(ev, 'focus');
            });
            document.addEventListener('focusout', (ev: FocusEvent) => {
                this.emitFocusEvent(ev, 'blur');
            });
        });
    }

    private emitFocusEvent(ev: FocusEvent, type: 'focus' | 'blur') {
        this.lastActiveElementSubject.next(document.activeElement);
        const achieved = this.lastPossibleFocusChangingEventSubject.value?.type === 'mousedown'
            ? 'mouse'
            : 'keyboard';
        this.ngZone.run(() => {
            this.focusStateSubject.next(new A11yFocusState(
                this.lastActiveElementSubject.value,
                ev,
                type,
                achieved
            ));
        });
    }

    screenreaderSpeak(text: string, priority: ScreenreaderPriority = ScreenreaderPriority.Polite): Observable<void> {
        const subj = new Subject<void>();
        let ap: AriaLivePoliteness;
        switch (priority) {
            case ScreenreaderPriority.Assertive: ap = 'assertive'; break;
            case ScreenreaderPriority.Polite: ap = 'polite'; break;
            case ScreenreaderPriority.Off: ap = 'off'; break;
        }
        this.liveAnnouncer.announce(text, ap).then(
            () => {
                subj.next();
                subj.complete();
            },
            reason => {
                subj.error(reason);
                subj.complete();
            }
        );
        return subj.asObservable();
    }

    emitElementFocusStateChange(element: HTMLElement): Observable<A11yFocusState> {
        return this.focusState$.pipe(
            // Nur Events, die das gewünschte Element oder ein Kind davon betreffen
            // (z.B. Fokus in einem Row-Element)
            //
            // Falls du wirklich nur genau `element` willst, nimm === statt contains
            filter(state => element.contains(state.event.target as Node))
        );
    }
}

