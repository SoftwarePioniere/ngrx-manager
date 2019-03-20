import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';

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
    NgrxManagerState
} from '../reducer';
// import {FeedbackService} from '../../providers/feedback-service/feedback.service';
// import {WebsocketStartAction} from '../websocket/websocket.actions';
// import {TranslateService} from '@ngx-translate/core';
// import {getCurrentLanguage, getTranslationInfoSichtbar, LangState} from '../../lang';
import {NetworkService} from '../network.service';
import {NgrxManagerService} from '../ngrx-manager.service';
import {Dictionary, Request} from '../model';
import {ActivatedRoute, Router} from '@angular/router';
import * as actions from '../actions';

@Component({
    selector: 'app-sync-dialog',
    templateUrl: './sync-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SyncDialogComponent implements OnInit, OnDestroy {
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
    public returnUrl: string;
    public queryParams: Subscription;

    constructor(public router: Router,
                public route: ActivatedRoute,
                public storeNgrxClientManager: Store<NgrxManagerState>,
                // public langStore: Store<LangState>,
                // public translate: TranslateService,
                private sanitizer: DomSanitizer,
                private networkService: NetworkService,
                private ngrxManagerService: NgrxManagerService) {
        // this.translate.setDefaultLang('de');
        // this.lang$ = langStore.pipe(select(getCurrentLanguage));
    }

    async goBack() {
        await this.router.navigate([this.returnUrl]);
    }

    async abbrechen() {
        await this.goBack();
    }

    ngOnDestroy(): void {
        if (this.queryParams != null) {
            this.queryParams.unsubscribe();
        }
    }

    ionViewWillLeave(): void {
        if (this.queryParams != null) {
            this.queryParams.unsubscribe();
        }
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

        // this.translationInfoSichtbar$ = this.langStore.pipe(select(getTranslationInfoSichtbar));
        // this.lang$ = this.langStore.pipe(select(getCurrentLanguage));
        // this.lang$.subscribe(lang => this.translate.use(lang));
        this.lang$.subscribe(lang => moment.locale(lang));

        // COMMAND
        this.requestStackServiceIsEnabled$ = this.ngrxManagerService.isEnabled$();
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

