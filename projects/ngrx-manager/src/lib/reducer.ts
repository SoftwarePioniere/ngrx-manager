import {Action, ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import {Dictionary, Request} from './model';
import * as actions from './actions';
import {Observable} from 'rxjs';


export const SopiNgrxManagerFeature = 'SopiNgrxManager';

export const reducers: ActionReducerMap<NgrxManagerModuleState> = {
    ngrxManager: ngrxManagerReducer
};

export interface NgrxManagerModuleState {
    ngrxManager: NgrxManagerState;
}

export interface NgrxManagerState {
    // GET
    queryStack: Dictionary<Request>;
    queryQueue: Dictionary<Request>;
    queryFailed: Array<Request>;

    // POST | PUT | DELETE
    commandStack: Dictionary<Request>;
    commandQueue: Array<Request>;
    commandFailed: Array<Request>;
}

export const initialNgrxManagerState: NgrxManagerState = {
    queryStack: new Dictionary<Request>(),
    queryQueue: new Dictionary<Request>(),
    queryFailed: [],
    commandStack: new Dictionary<Request>(),
    commandQueue: [],
    commandFailed: []
};

export function ngrxManagerReducer(state = initialNgrxManagerState, action: Action): NgrxManagerState {
    switch (action.type) {

        // QUERY
        case actions.QUERY_STACK_UPDATE: {
            const a = <actions.QueryStackUpdateAction>action;

            return Object.assign({}, state, <NgrxManagerState>{
                ...state,
                queryStack: a.queryStack
            });
        }

        case actions.QUERY_QUEUE_UPDATE: {
            const a = <actions.QueryQueueUpdateAction>action;

            return Object.assign({}, state, <NgrxManagerState>{
                ...state,
                queryQueue: a.queryQueue
            });
        }

        case actions.QUERY_FAILED_UPDATE: {
            const a = <actions.QueryFailedUpdateAction>action;

            return Object.assign({}, state, <NgrxManagerState>{
                ...state,
                queryFailed: a.queryFailed
            });
        }


        // COMMAND
        case actions.COMMAND_STACK_UPDATE: {
            const a = <actions.CommandStackUpdateAction>action;

            return Object.assign({}, state, <NgrxManagerState>{
                ...state,
                commandStack: a.commandStack
            });
        }

        case actions.COMMAND_QUEUE_UPDATE: {
            const a = <actions.CommandQueueUpdateAction>action;

            return Object.assign({}, state, <NgrxManagerState>{
                ...state,
                commandQueue: a.commandQueue
            });
        }

        case actions.COMMAND_FAILED_UPDATE: {
            const a = <actions.CommandFailedUpdateAction>action;

            return Object.assign({}, state, <NgrxManagerState>{
                ...state,
                commandFailed: a.commandFailed
            });
        }


        case actions.CLEAR_REQUESTS: {
            const a = <actions.ClearRequestsAction>action;

            return Object.assign({}, state, <NgrxManagerState>{
                ...state,
                initialNgrxManagerState
            });
        }


        default: {
            return state;
        }
    }
}


export const getModuleState = createFeatureSelector<NgrxManagerModuleState>(SopiNgrxManagerFeature);

export const getNgrxClientManagerState = createSelector(getModuleState, (state: NgrxManagerModuleState) => state.ngrxManager);

export const getQueryStack = createSelector(getNgrxClientManagerState, (state: NgrxManagerState) => {
    return new Dictionary<Request>(state.queryStack._values.map((item) => {
        return {key: item.key, value: item};
    }));
});
export const getQueryQueue = createSelector(getNgrxClientManagerState, (state: NgrxManagerState) => {
    return new Dictionary<Request>(state.queryQueue._values.map((item) => {
        return {key: item.key, value: item};
    }));
});
export const getQueryFailed = createSelector(getNgrxClientManagerState, (state: NgrxManagerState) => state.queryFailed);
export const getCommandStack = createSelector(getNgrxClientManagerState, (state: NgrxManagerState) => {
    return new Dictionary<Request>(state.commandStack._values.map((item) => {
        return {key: item.key, value: item};
    }));
});
export const getCommandQueue = createSelector(getNgrxClientManagerState, (state: NgrxManagerState) => {
    return Array.from(state.commandQueue);
});
export const getCommandFailed = createSelector(getNgrxClientManagerState, (state: NgrxManagerState) => {
    return Array.from(state.commandFailed);
});


// COUNT
export const getQueryStackCount = createSelector(getQueryStack, (queryStack: Dictionary<Request>) => {
    if(queryStack === null || queryStack._values === null) {
        return 0;
    }
    return queryStack._values.length;
});
export const getQueryQueueCount = createSelector(getQueryQueue, (queryQueue: Dictionary<Request>) => {
    console.log(queryQueue._values.length);
    return queryQueue._values.length;
});
export const getQueryFailedCount = createSelector(getQueryFailed, (queryFailed: Array<Request>) => {
    if(queryFailed === null) {
        return 0;
    }
    return queryFailed.length;
});


export const getCommandStackCount = createSelector(getCommandStack, (commandStack: Dictionary<Request>) => {
    if(commandStack === null || commandStack._values === null) {
        return 0;
    }
    return commandStack._values.length;
});
export const getCommandQueueCount = createSelector(getCommandQueue, (commandQueue: Array<Request>) => {
    if(commandQueue === null) {
        return 0;
    }
    return commandQueue.length;
});
export const getCommandFailedCount = createSelector(getCommandFailed, (commandFailed: Array<Request>) => {
    if(commandFailed === null) {
        return 0;
    }
    return commandFailed.length;
});
