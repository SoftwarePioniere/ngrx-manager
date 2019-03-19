import {Action, ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import {Dictionary, Request} from './model';
import * as actions from './actions';
import {Observable} from 'rxjs';


export const SopiNgrxClientManagerFeature = 'SopiNgrxClientManager';

export const reducers: ActionReducerMap<NgrxClientManagerModuleState> = {
    ngrxClientManager: ngrxClientManagerReducer
};

export interface NgrxClientManagerModuleState {
    ngrxClientManager: NgrxClientManagerState;
}

export interface NgrxClientManagerState {
    // GET
    queryStack: Dictionary<Request>;
    queryQueue: Dictionary<Request>;
    queryFailed: Array<Request>;

    // POST | PUT | DELETE
    commandStack: Dictionary<Request>;
    commandQueue: Array<Request>;
    commandFailed: Array<Request>;
}

export const initialNgrxClientManagerState: NgrxClientManagerState = {
    queryStack: new Dictionary<Request>(),
    queryQueue: new Dictionary<Request>(),
    queryFailed: [],
    commandStack: new Dictionary<Request>(),
    commandQueue: [],
    commandFailed: []
};

export function ngrxClientManagerReducer(state = initialNgrxClientManagerState, action: Action): NgrxClientManagerState {
    switch (action.type) {

        // QUERY
        case actions.QUERY_STACK_UPDATE: {
            const a = <actions.QueryStackUpdateAction>action;

            return Object.assign({}, state, <NgrxClientManagerState>{
                ...state,
                queryStack: a.queryStack
            });
        }

        case actions.QUERY_QUEUE_UPDATE: {
            const a = <actions.QueryQueueUpdateAction>action;

            return Object.assign({}, state, <NgrxClientManagerState>{
                ...state,
                queryQueue: a.queryQueue
            });
        }

        case actions.QUERY_FAILED_UPDATE: {
            const a = <actions.QueryFailedUpdateAction>action;

            return Object.assign({}, state, <NgrxClientManagerState>{
                ...state,
                queryFailed: a.queryFailed
            });
        }


        // COMMAND
        case actions.COMMAND_STACK_UPDATE: {
            const a = <actions.CommandStackUpdateAction>action;

            return Object.assign({}, state, <NgrxClientManagerState>{
                ...state,
                commandStack: a.commandStack
            });
        }

        case actions.COMMAND_QUEUE_UPDATE: {
            const a = <actions.CommandQueueUpdateAction>action;

            return Object.assign({}, state, <NgrxClientManagerState>{
                ...state,
                commandQueue: a.commandQueue
            });
        }

        case actions.COMMAND_FAILED_UPDATE: {
            const a = <actions.CommandFailedUpdateAction>action;

            return Object.assign({}, state, <NgrxClientManagerState>{
                ...state,
                commandFailed: a.commandFailed
            });
        }


        case actions.CLEAR_REQUESTS: {
            const a = <actions.ClearRequestsAction>action;

            console.log('CLEAR REQUESTS!!');
            return Object.assign({}, state, <NgrxClientManagerState>{
                ...state,
                initialNgrxClientManagerState
            });
        }


        default: {
            return state;
        }
    }
}


export const getModuleState = createFeatureSelector<NgrxClientManagerModuleState>(SopiNgrxClientManagerFeature);

export const getNgrxClientManagerState = createSelector(getModuleState, (state: NgrxClientManagerModuleState) => state.ngrxClientManager);

export const getQueryStack = createSelector(getNgrxClientManagerState, (state: NgrxClientManagerState) => {
    return new Dictionary<Request>(state.queryStack._values.map((item) => {
        return {key: item.key, value: item};
    }));
});
export const getQueryQueue = createSelector(getNgrxClientManagerState, (state: NgrxClientManagerState) => {
    return new Dictionary<Request>(state.queryQueue._values.map((item) => {
        return {key: item.key, value: item};
    }));
});
export const getQueryFailed = createSelector(getNgrxClientManagerState, (state: NgrxClientManagerState) => state.queryFailed);
export const getCommandStack = createSelector(getNgrxClientManagerState, (state: NgrxClientManagerState) => {
    return new Dictionary<Request>(state.commandStack._values.map((item) => {
        return {key: item.key, value: item};
    }));
});
export const getCommandQueue = createSelector(getNgrxClientManagerState, (state: NgrxClientManagerState) => {
    return Array.from(state.commandQueue);
});
export const getCommandFailed = createSelector(getNgrxClientManagerState, (state: NgrxClientManagerState) => {
    return Array.from(state.commandFailed);
});


// COUNT
export const getQueryStackCount = createSelector(getQueryStack, (queryStack: Dictionary<Request>) => {
    console.log(queryStack._values.length);
    return queryStack._values.length;
});
export const getQueryQueueCount = createSelector(getQueryQueue, (queryQueue: Dictionary<Request>) => {
    console.log(queryQueue._values.length);
    return queryQueue._values.length;
});
export const getQueryFailedCount = createSelector(getQueryFailed, (queryFailed: Array<Request>) => {
    console.log(queryFailed.length);
    return queryFailed.length;
});


export const getCommandStackCount = createSelector(getCommandStack, (commandStack: Dictionary<Request>) => {
    console.log(commandStack._values.length);
    return commandStack._values.length;
});
export const getCommandQueueCount = createSelector(getCommandQueue, (commandQueue: Array<Request>) => {
    console.log(commandQueue.length);
    return commandQueue.length;
});
export const getCommandFailedCount = createSelector(getCommandFailed, (commandFailed: Array<Request>) => {
    console.log(commandFailed.length);
    return commandFailed.length;
});
