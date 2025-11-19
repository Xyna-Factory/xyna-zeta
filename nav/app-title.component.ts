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
import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterState } from '@angular/router';

import { filter, map } from 'rxjs/operators';


@Component({
    template: '',
    standalone: false
})
export class AppTitleComponent implements OnInit {

    protected readonly router = inject(Router);
    protected readonly titleService = inject(Title);

    private readonly projectTitle = window.document.title ?? 'Xyna';


    ngOnInit() {
        const projectTitle = this.defaultTitle();

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => this.router)
            )
            .subscribe(() => {
                let title = this.getTitle(this.router.routerState, this.router.routerState.root).join(' | ');
                title = title ? ' | ' + title : '';
                this.titleService.setTitle(projectTitle + title);
            });
    }


    getTitle(state: RouterState, parent: ActivatedRoute) {
        const data = [];
        if (parent) {
            if (parent.snapshot.data?.title) {
                data.push(parent.snapshot.data.title);
            }
            if (state) {
                data.push(...this.getTitle(state, (state as any).firstChild(parent)));
            }
        }
        return data;
    }


    defaultTitle(): string {
        return this.projectTitle;
    }
}
