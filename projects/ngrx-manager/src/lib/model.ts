import {Action} from '@ngrx/store';

export enum RequestType {
    Anfrage,
    Erfolgreich,
    Fehler
}

export enum RequestMethod {
    QUERY,
    COMMAND
}

export interface Request {
    key: string;
    method: RequestMethod;
    type: RequestType;
    action: any;
    count: number;
    error: any;
    date: Date;
}


export interface IDictionary<T> {
    add(key: string, value: T): void;

    remove(key: string): void;

    item(key: string): T;

    containsKey(key: string): boolean;

    keys(): string[];

    values(): T[];
}

export class Dictionary<T> implements IDictionary<T> {

    _keys: string[] = [];
    _values: T[] = [];

    constructor(init?: { key: string; value: T; }[]) {
        if (init) {
            for (let x = 0; x < init.length; x++) {
                this[init[x].key] = init[x].value;
                this._keys.push(init[x].key);
                this._values.push(init[x].value);
            }
        }
    }

    add(key: string, value: T) {
        if (this[key] === undefined) {
            this[key] = value;
            this._keys.push(key);
            this._values.push(value);
        }
    }

    remove(key: string) {
        const index = this._keys.indexOf(key, 0);
        this._keys.splice(index, 1);
        this._values.splice(index, 1);

        delete this[key];
    }

    item(key: string): T {
        return this[key];
    }

    keys(): string[] {
        return this._keys;
    }

    values(): T[] {
        return this._values;
    }

    containsKey(key: string) {
        if (typeof this[key] === 'undefined') {
            return false;
        }

        return true;
    }

    toLookup(): IDictionary<T> {
        return this;
    }
}

export interface NgrxClientManagerConfig {
    cache: boolean;
}

export interface NgRxClientManagerAction extends Action {
    optParams: any;
}
