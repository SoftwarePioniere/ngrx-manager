import {Action} from '@ngrx/store';
import {Dictionary, Request, RequestMethod, RequestType} from './model';

// QUERY
export const QUERY_STACK_ADD = '[NgrxClientManager] Query in QUERY_STACK hinzufügen';
export const QUERY_STACK_REMOVE = '[NgrxClientManager] Query von QUERY_STACK enfernen';
export const QUERY_QUEUE_ADD = '[NgrxClientManager] Query in QUERY_QUEUE hinzufügen';
export const QUERY_QUEUE_REMOVE = '[NgrxClientManager] Query von QUERY_QUEUE enfernen';
export const QUERY_FAILED_ADD = '[NgrxClientManager] Query in QUERY_FAILED hinzufügen';
export const QUERY_FAILED_REMOVE = '[NgrxClientManager] Query von QUERY_FAILED enfernen';
export const QUERY_STACK_UPDATE = '[NgrxClientManager] QueryStack Update';
export const QUERY_QUEUE_UPDATE = '[NgrxClientManager] QueryQueue Update';
export const QUERY_FAILED_UPDATE = '[NgrxClientManager] QueryFailed Update';
export const QUERY_QUEUE_NEXT = '[NgrxClientManager] Get next action from query Queue';
export const QUERY_STACK_CLEANUP = '[NgrxClientManager] Clean up the query stack';

// COMMAND
export const COMMAND_STACK_ADD = '[NgrxClientManager] Command in COMMAND_STACK hinzufügen';
export const COMMAND_STACK_REMOVE = '[NgrxClientManager] Command von COMMAND_STACK enfernen';
export const COMMAND_QUEUE_ADD = '[NgrxClientManager] Command in COMMAND_QUEUE hinzufügen';
export const COMMAND_QUEUE_REMOVE = '[NgrxClientManager] Command von COMMAND_QUEUE enfernen';
export const COMMAND_FAILED_ADD = '[NgrxClientManager] Command in COMMAND_FAILED hinzufügen';
export const COMMAND_FAILED_REMOVE = '[NgrxClientManager] Command von COMMAND_FAILED enfernen';
export const COMMAND_STACK_UPDATE = '[NgrxClientManager] CommandStack Update';
export const COMMAND_QUEUE_UPDATE = '[NgrxClientManager] CommandQueue Update';
export const COMMAND_FAILED_UPDATE = '[NgrxClientManager] CommandFailed Update';
export const COMMAND_QUEUE_NEXT = '[NgrxClientManager] Get next action from command Queue';
export const COMMAND_STACK_CLEANUP = '[NgrxClientManager] Clean up the command stack';

export const CLEAR_REQUESTS = '[NgrxClientManager] Clear all Requests from Store';

// QUERIES
export class QueryStackAddAction implements Action {
    readonly type = QUERY_STACK_ADD;

    constructor(public key: string, public action: any, public method: RequestMethod, public requestType: RequestType, public date: Date|null = null, public error: any = null) {
    }
}

export class QueryStackRemoveAction implements Action {
    readonly type = QUERY_STACK_REMOVE;

    constructor(public key: string) {
    }
}

export class QueryStackUpdateAction implements Action {
    readonly type = QUERY_STACK_UPDATE;

    constructor(public queryStack: Dictionary<Request>) {
    }
}


export class QueryQueueAddAction implements Action {
    readonly type = QUERY_QUEUE_ADD;

    constructor(public key: string, public action: any, public method: RequestMethod, public requestType: RequestType, public date: Date|null  = null, public error: any = null) {
    }
}

export class QueryQueueRemoveAction implements Action {
    readonly type = QUERY_QUEUE_REMOVE;

    constructor(public key: string) {
    }
}

export class QueryQueueUpdateAction implements Action {
    readonly type = QUERY_QUEUE_UPDATE;

    constructor(public queryQueue: Dictionary<Request>) {
    }
}


export class QueryFailedAddAction implements Action {
    readonly type = QUERY_FAILED_ADD;

    constructor(public key: string, public action: any, public method: RequestMethod, public requestType: RequestType, public date: Date|null  = null, public error: any = null) {
    }
}

export class QueryFailedRemoveAction implements Action {
    readonly type = QUERY_FAILED_REMOVE;

    constructor(public key: string) {
    }
}

export class QueryFailedUpdateAction implements Action {
    readonly type = QUERY_FAILED_UPDATE;

    constructor(public queryFailed: Array<Request>) {
    }
}

export class QueryQueueNextAction implements Action {
    readonly type = QUERY_QUEUE_NEXT;

    constructor() {
    }
}

export class QueryStackCleanUpAction implements Action {
    readonly type = QUERY_STACK_CLEANUP;

    constructor() {
    }
}


// COMMANDS
export class CommandStackAddAction implements Action {
    readonly type = COMMAND_STACK_ADD;

    constructor(public key: string, public action: any, public method: RequestMethod, public requestType: RequestType, public date: Date|null  = null, public error: any = null) {
    }
}

export class CommandStackRemoveAction implements Action {
    readonly type = COMMAND_STACK_REMOVE;

    constructor(public key: string) {
    }
}

export class CommandStackUpdateAction implements Action {
    readonly type = COMMAND_STACK_UPDATE;

    constructor(public commandStack: Dictionary<Request>) {
    }
}


export class CommandQueueAddAction implements Action {
    readonly type = COMMAND_QUEUE_ADD;

    constructor(public key: string, public action: any, public method: RequestMethod, public requestType: RequestType, public date: Date|null  = null, public error: any = null) {
    }
}

export class CommandQueueRemoveAction implements Action {
    readonly type = COMMAND_QUEUE_REMOVE;

    constructor(public key: string) {
    }
}

export class CommandQueueUpdateAction implements Action {
    readonly type = COMMAND_QUEUE_UPDATE;

    constructor(public commandQueue: Array<Request>) {
    }
}


export class CommandFailedAddAction implements Action {
    readonly type = COMMAND_FAILED_ADD;

    constructor(public key: string, public action: any, public method: RequestMethod, public requestType: RequestType, public date: Date|null  = null, public error: any = null) {
    }
}

export class CommandFailedRemoveAction implements Action {
    readonly type = COMMAND_FAILED_REMOVE;

    constructor(public key: string) {
    }
}

export class CommandFailedUpdateAction implements Action {
    readonly type = COMMAND_FAILED_UPDATE;

    constructor(public commandFailed: Array<Request>) {
    }
}


export class CommandQueueNextAction implements Action {
    readonly type = COMMAND_QUEUE_NEXT;

    constructor() {
    }
}


export class CommandStackCleanUpAction implements Action {
    readonly type = COMMAND_STACK_CLEANUP;

    constructor() {
    }
}


export class ClearRequestsAction implements Action {
    readonly type = COMMAND_STACK_CLEANUP;

    constructor() {
    }
}


export type Actions =
    QueryStackAddAction
    | QueryStackRemoveAction
    | QueryStackUpdateAction
    | QueryStackCleanUpAction

    | QueryQueueAddAction
    | QueryQueueRemoveAction
    | QueryQueueUpdateAction
    | QueryQueueNextAction

    | QueryFailedAddAction
    | QueryFailedRemoveAction
    | QueryFailedUpdateAction


    | CommandStackAddAction
    | CommandStackRemoveAction
    | CommandStackUpdateAction
    | CommandStackCleanUpAction

    | CommandQueueAddAction
    | CommandQueueRemoveAction
    | CommandQueueUpdateAction
    | CommandQueueNextAction

    | CommandFailedAddAction
    | CommandFailedRemoveAction
    | CommandFailedUpdateAction

    | ClearRequestsAction
    ;
