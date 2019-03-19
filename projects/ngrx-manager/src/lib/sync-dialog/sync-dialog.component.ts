import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {select, Store} from '@ngrx/store';
import {DomSanitizer} from '@angular/platform-browser';
import * as moment from 'moment';

import {
    getCommandFailed,
    getCommandFailedCount,
    getCommandQueue,
    getCommandQueueCount,
    getCommandStack,
    getCommandStackCount,
    getQueryFailed,
    getQueryFailedCount,
    getQueryQueue,
    getQueryQueueCount,
    getQueryStack,
    getQueryStackCount,
    NgrxClientManagerState
} from '../reducer';
import {FeedbackService} from '../../providers/feedback-service/feedback.service';
import {WebsocketStartAction} from '../websocket/websocket.actions';
import {TranslateService} from '@ngx-translate/core';
import {getCurrentLanguage, getTranslationInfoSichtbar, LangState} from '../../lang';
import {NetworkService} from '../../providers/network.service';
import {RequestStackService} from '../request-stack.service';
import {Dictionary, Request} from '../model';
import {DialogeBase} from '../../../pages/dialoge.base';
import {ActivatedRoute, Router} from '@angular/router';
import * as actions from '../actions';

@Component({
    selector: 'app-sync-dialog',
    templateUrl: './sync-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SyncDialogComponent extends DialogeBase implements OnInit {
    isOnline$: Observable<Boolean>;


    lang = new Subject<string>();
    lang$: Observable<string>;
    translationInfoSichtbar$: Observable<boolean>;

    requestStackServiceIsEnabled$: Observable<boolean>;
    commandStackCount$: Observable<Number>;
    commandQueueCount$: Observable<Number>;
    commandFailedCount$: Observable<Number>;

    queryStackCount$: Observable<Number>;
    queryQueueCount$: Observable<Number>;
    queryFailedCount$: Observable<Number>;

    commandStack$: Observable<Dictionary<Request>>;
    commandQueue$: Observable<Request[]>;
    commandFailed$: Observable<Request[]>;

    queryStack$: Observable<Dictionary<Request>>;
    queryQueue$: Observable<Dictionary<Request>>;
    queryFailed$: Observable<Request[]>;


    constructor(public router: Router,
                public route: ActivatedRoute,
                public storeNgrxClientManager: Store<NgrxClientManagerState>,
                public translate: TranslateService,
                public langStore: Store<LangState>,
                private sanitizer: DomSanitizer,
                private networkService: NetworkService,
                private requestStackService: RequestStackService) {
        super(router, langStore, translate);
    }

    async ionWillOpen() {
    }

    ionDidOpen() {

    }

    restartApplication() {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.returnUrl = params.returnUrl;
        });

        this.isOnline$ = this.networkService.isOnline();

        this.translationInfoSichtbar$ = this.langStore.pipe(select(getTranslationInfoSichtbar));
        this.lang$ = this.langStore.pipe(select(getCurrentLanguage));
        this.lang$.subscribe(lang => this.translate.use(lang));
        this.lang$.subscribe(lang => moment.locale(lang));

        // COMMAND
        this.requestStackServiceIsEnabled$ = this.requestStackService.isEnabled$();
        this.commandStackCount$ = this.storeNgrxClientManager.pipe(select(getCommandStackCount));
        this.commandQueueCount$ = this.storeNgrxClientManager.pipe(select(getCommandQueueCount));
        this.commandFailedCount$ = this.storeNgrxClientManager.pipe(select(getCommandFailedCount));
        this.commandStack$ = this.storeNgrxClientManager.pipe(select(getCommandStack));
        this.commandQueue$ = this.storeNgrxClientManager.pipe(select(getCommandQueue));
        this.commandFailed$ = this.storeNgrxClientManager.pipe(select(getCommandFailed));

        // QUERY
        this.queryStackCount$ = this.storeNgrxClientManager.pipe(select(getQueryStackCount));
        this.queryQueueCount$ = this.storeNgrxClientManager.pipe(select(getQueryQueueCount));
        this.queryFailedCount$ = this.storeNgrxClientManager.pipe(select(getQueryFailedCount));
        this.queryStack$ = this.storeNgrxClientManager.pipe(select(getQueryStack));
        this.queryQueue$ = this.storeNgrxClientManager.pipe(select(getQueryQueue));
        this.queryFailed$ = this.storeNgrxClientManager.pipe(select(getQueryFailed));
    }

    async datenSenden() {
        await this.storeNgrxClientManager.dispatch(new actions.CommandQueueNextAction());
    }
}

