import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {getCommandFailed, getCommandQueue, getCommandStack, getQueryFailed, getQueryQueue, getQueryStack, NgrxClientManagerState} from './reducer';
import {Observable} from 'rxjs';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import * as actions from './actions';
import {Dictionary, Request} from './model';

@Injectable()
export class NgrxManagerEffects {
    // QUEUES
    @Effect()
    queryStackAddAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.QueryStackAddAction>(actions.QUERY_STACK_ADD)
        , withLatestFrom(this.store.pipe(select(getQueryStack)))
        , map(([x, queryStack]: [actions.QueryStackAddAction, Dictionary<Request>]) => {
            const request = <Request>{
                key: x.key,
                method: x.method,
                type: x.requestType,
                action: x.action,
                count: 0,
                error: null,
                date: x.date
            };
            queryStack.add(x.key, request);
            return new actions.QueryStackUpdateAction(queryStack);
        })
    );


    @Effect()
    queryStackRemoveAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.QueryStackRemoveAction>(actions.QUERY_STACK_REMOVE)
        , withLatestFrom(this.store.pipe(select(getQueryStack)))
        , map(([x, queryStack]: [actions.QueryStackRemoveAction, Dictionary<Request>]) => {
            queryStack.remove(x.key);

            return new actions.QueryStackUpdateAction(queryStack);
        })
    );


    @Effect()
    queryStackCleanUpAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.QueryStackCleanUpAction>(actions.QUERY_STACK_CLEANUP)
        , withLatestFrom(this.store.pipe(select(getQueryStack)), this.store.pipe(select(getQueryQueue)))
        , switchMap(([x, queryStack, queryQueue]: [actions.QueryStackCleanUpAction, Dictionary<Request>, Dictionary<Request>]) => {
            const queryStackValues = queryStack.values();

            queryStackValues.forEach(() => {
                const request = queryStackValues.shift();
                if (!queryQueue.containsKey(request.key)) {
                    queryQueue.add(request.key, request);
                }
            });

            return [
                new actions.QueryStackUpdateAction(queryStack),
                new actions.QueryQueueUpdateAction(queryQueue)
            ];
        })
    );


    @Effect()
    queryQueueAddAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.QueryQueueAddAction>(actions.QUERY_QUEUE_ADD)
        , withLatestFrom(this.store.pipe(select(getQueryQueue)))
        , map(([x, queryQueue]: [actions.QueryQueueAddAction, Dictionary<Request>]) => {
            const request = <Request>{
                key: x.key,
                method: x.method,
                type: x.requestType,
                action: x.action,
                count: 0,
                error: null,
                date: x.date
            };

            queryQueue.add(x.key, request);
            return new actions.QueryQueueUpdateAction(queryQueue);
        })
    );


    @Effect()
    queryQueueRemoveAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.QueryQueueRemoveAction>(actions.QUERY_QUEUE_REMOVE)
        , withLatestFrom(this.store.pipe(select(getQueryQueue)))
        , map(([x, queryQueue]: [actions.QueryQueueRemoveAction, Dictionary<Request>]) => {
            queryQueue.remove(x.key);

            return new actions.QueryQueueUpdateAction(queryQueue);
        })
    );

    @Effect()
    queryQueueNextAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.QueryQueueNextAction>(actions.QUERY_QUEUE_NEXT)
        , withLatestFrom(this.store.pipe(select(getQueryQueue)), this.store.pipe(select(getQueryStack)))
        , switchMap(([x, queryQueue, queryStack]: [actions.QueryQueueNextAction, Dictionary<Request>, Dictionary<Request>]) => {
            const res = [];

            // TZ: GEÄNDERT !!!!!!!!!!!
            // const queryStackTmp = queryStack.values();
            // // for (let i = 0; i < queryStackTmp.length; i++) {
            //     const request = queryStackTmp.shift();
            //     if (request !== undefined && request.action !== undefined) {
            //         res.push(request.action);
            //     }
            // }

            const queryQueueTmp = queryQueue.values();
            // for (let i = 0; i < queryQueueTmp.length; i++) {
                const request = queryQueueTmp.shift();
                if (request !== undefined && request.action !== undefined) {
                    res.push(request.action);
                }
            // }

            res.unshift(new actions.QueryStackUpdateAction(queryStack));
            res.unshift(new actions.QueryQueueUpdateAction(queryQueue));

            return res;
        })
    );


    @Effect()
    queryFailedAddAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.QueryFailedAddAction>(actions.QUERY_FAILED_ADD)
        , withLatestFrom(this.store.pipe(select(getQueryFailed)))
        , map(([x, queryFailed]: [actions.QueryFailedAddAction, Array<Request>]) => {
            const request = <Request>{
                key: x.key,
                method: x.method,
                type: x.requestType,
                action: x.action,
                count: 0,
                error: x.error,
                date: x.date
            };
            queryFailed.push(request);
            return new actions.QueryFailedUpdateAction(queryFailed);
        })
    );


    @Effect()
    queryFailedRemoveAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.QueryFailedRemoveAction>(actions.QUERY_FAILED_REMOVE)
        , withLatestFrom(this.store.pipe(select(getQueryFailed)))
        , map(([x, queryFailed]: [actions.QueryFailedRemoveAction, Array<Request>]) => {
            const seachIndex = queryFailed.findIndex((item) => item.key === x.key);
            const queryFailedTmp = queryFailed.splice(seachIndex, 1);

            return new actions.QueryFailedUpdateAction(queryFailedTmp);
        })
    );


    // COMMANDS
    @Effect()
    commandStackAddAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.CommandStackAddAction>(actions.COMMAND_STACK_ADD)
        , withLatestFrom(this.store.pipe(select(getCommandStack)))
        , map(([x, commandStack]: [actions.CommandStackAddAction, Dictionary<Request>]) => {
            const request = <Request>{
                key: x.key,
                method: x.method,
                type: x.requestType,
                action: x.action,
                count: 0,
                error: null,
                date: x.date
            };
            commandStack.add(x.key, request);
            return new actions.CommandStackUpdateAction(commandStack);
        })
    );


    @Effect()
    commandStackRemoveAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.CommandStackRemoveAction>(actions.COMMAND_STACK_REMOVE)
        , withLatestFrom(this.store.pipe(select(getCommandStack)))
        , map(([x, commandStack]: [actions.CommandStackRemoveAction, Dictionary<Request>]) => {
            // res = commandStack.add(x.key, request);
            commandStack.remove(x.key);

            return new actions.CommandStackUpdateAction(commandStack);
        })
    );


    @Effect()
    commandStackCleanUpAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.CommandStackCleanUpAction>(actions.COMMAND_STACK_CLEANUP)
        , withLatestFrom(this.store.pipe(select(getCommandStack)), this.store.pipe(select(getCommandQueue)))
        , switchMap(([x, commandStack, commandQueue]: [actions.CommandStackCleanUpAction, Dictionary<Request>, Array<Request>]) => {
            const commandStackValues = commandStack.values();

            for (let i = 0; i < commandStackValues.length; i++) {
                const request = commandStackValues.shift();
                commandStack.remove(request.key);
                if (request !== undefined && request.action !== undefined) {
                    commandQueue.unshift(request.action);
                }
            }

            return [
                new actions.CommandStackUpdateAction(commandStack),
                new actions.CommandQueueUpdateAction(commandQueue)
            ];
        })
    );


    @Effect()
    commandQueueAddAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.CommandQueueAddAction>(actions.COMMAND_QUEUE_ADD)
        , withLatestFrom(this.store.pipe(select(getCommandQueue)))
        , map(([x, commandQueue]: [actions.CommandQueueAddAction, Array<Request>]) => {
            const request = <Request>{
                key: x.key,
                method: x.method,
                type: x.requestType,
                action: x.action,
                count: 0,
                error: null,
                date: x.date
            };
            commandQueue.push(request);
            return new actions.CommandQueueUpdateAction(commandQueue);
        })
    );


    @Effect()
    commandQueueRemoveAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.CommandQueueRemoveAction>(actions.COMMAND_QUEUE_REMOVE)
        , withLatestFrom(this.store.pipe(select(getCommandQueue)))
        , map(([x, commandQueue]: [actions.CommandQueueRemoveAction, Array<Request>]) => {
            const seachIndex = commandQueue.findIndex((item) => item.key === x.key);
            const commandQueueTmp = commandQueue.splice(seachIndex, 1);

            return new actions.CommandQueueUpdateAction(commandQueueTmp);
        })
    );


    @Effect()
    commandQueueNextAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.CommandQueueNextAction>(actions.COMMAND_QUEUE_NEXT)
        , withLatestFrom(this.store.pipe(select(getCommandQueue)))
        , switchMap(([x, commandQueue]: [actions.CommandQueueNextAction, Array<Request>]) => {
            const res = [];
            // for (let i = 0; i < commandQueue.length; i++) {
                const request = commandQueue.shift();
                if (request !== undefined && request.action !== undefined) {
                    res.push(request.action);
                }
            // }
            res.unshift(new actions.CommandQueueUpdateAction(commandQueue));
            return res;
        })
    );

    @Effect()
    commandFailedAddAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.CommandFailedAddAction>(actions.COMMAND_FAILED_ADD)
        , withLatestFrom(this.store.pipe(select(getCommandFailed)))
        , map(([x, commandFailed]: [actions.CommandFailedAddAction, Array<Request>]) => {
            const request = <Request>{
                key: x.key,
                method: x.method,
                type: x.requestType,
                action: x.action,
                count: 0,
                error: x.error,
                date: x.date
            };
            commandFailed.push(request);
            return new actions.CommandFailedUpdateAction(commandFailed);
        })
    );


    @Effect()
    commandFailedRemoveAction$: Observable<Action> = this.actions$.pipe(
        ofType<actions.CommandFailedRemoveAction>(actions.COMMAND_FAILED_REMOVE)
        , withLatestFrom(this.store.pipe(select(getCommandFailed)))
        , map(([x, commandFailed]: [actions.CommandFailedRemoveAction, Array<Request>]) => {
            const seachIndex = commandFailed.findIndex((item) => item.key === x.key);
            const commandFailedTmp = commandFailed.splice(seachIndex, 1);

            return new actions.CommandFailedUpdateAction(commandFailedTmp);
        })
    );

    constructor(private actions$: Actions,
                private store: Store<any>) {
    }
}
