import {Injectable} from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {Action, select, Store} from '@ngrx/store';

import {ConnectionStatus, NetworkService} from './network.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Dictionary, NgrxClientManagerConfig, Request, RequestMethod, RequestType} from './model';
import * as actions from './actions';
import {getCommandFailed, getCommandQueue, getCommandStack, getQueryFailed, getQueryQueue, getQueryStack, NgrxClientManagerState} from './reducer';
import {HttpErrorResponse} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class NgrxManagerService {

  enabled$ = new BehaviorSubject(true);

  // GET
  queryStack: Dictionary<Request>;
  queryQueue: Dictionary<Request>;
  queryFailed: Array<Request>;

  // POST | PUT | DELETE
  commandStack: Dictionary<Request>;
  commandQueue: Array<Request>;
  commandFailed: Array<Request>;

  // STATUS
  commandStack$ = new Subject<Dictionary<Request>>();
  commandQueue$ = new Subject<Array<Request>>();
  commandFailed$ = new Subject<Array<Request>>();

  constructor(private store: Store<NgrxClientManagerState>,
              private networkService: NetworkService
  ) {
    // QUERY
    store.pipe(select(getQueryStack)).subscribe((item) => {
      this.queryStack = item;
    });

    store.pipe(select(getQueryQueue)).subscribe((item) => {
      this.queryQueue = item;
    });

    store.pipe(select(getQueryFailed)).subscribe((item) => {
      this.queryFailed = item;
    });

    // COMMAND
    store.pipe(select(getCommandStack)).subscribe((item) => {
      this.commandStack = item;
    });

    store.pipe(select(getCommandQueue)).subscribe((item) => {
      this.commandQueue = item;
    });

    store.pipe(select(getCommandFailed)).subscribe((item) => {
      this.commandFailed = item;
    });

    // NETWORK DETECTION
    networkService.onNetworkChange().subscribe((connectionStatus: ConnectionStatus) => {
      if (connectionStatus === ConnectionStatus.Online) {
        console.log('ONLINE');
        this.checkQueue();
      }

      if (connectionStatus === ConnectionStatus.Offline) {
        console.log('OFFLINE');
        this.store.dispatch(new actions.QueryStackCleanUpAction());
        this.store.dispatch(new actions.CommandStackCleanUpAction());
      }
    });
  }

  // 1. Alle Client-NGRX Anfragen prüfen über diese Funktion erst einmal ob sie die Anfrage stellen dürfen
  public callRequest(key: string, action: Action, method: RequestMethod, type: RequestType): boolean {
    if (!this.enabled$.getValue()) {
      return true;
    }
    // ONLINE
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
      console.log('ONLINE LOGIK');
      return this.onlineLogik(key, action, method, type);
    } else {
      // OFFLINE - Wenn Offline, alles in die Queue schreiben
      console.log('OFFLINE LOGIK');
      return this.offlineLogik(key, action, method, type);
    }
  }

  // 2. Wenn die Client-NGRX Anfrage durchgeführt wurde (Erfolgreich oder Fehler) wird diese Info an diese Funktion übergeben
  public checkRequest(key: string, action: Action, method: RequestMethod, type: RequestType, error: HttpErrorResponse = null): void {
    // QUERY
    // -----
    if (method === RequestMethod.QUERY) {
      if (type === RequestType.Erfolgreich) {
        console.log('RM:: checkRequest :: QUERY :: ERFOLGREICH', key);
        this.store.dispatch(new actions.QueryStackRemoveAction(key));
        this.store.dispatch(new actions.QueryQueueNextAction());
      }

      if (type === RequestType.Fehler) {

        console.log('ERROR', error);
        console.log('RM:: checkRequest :: QUERY :: FEHLER', key);
        const item = this.queryStack.item(key);
        if (item !== undefined && item.action !== undefined) {
          this.store.dispatch(new actions.QueryStackRemoveAction(item.key));
        }

        if (item !== undefined && item.action !== undefined) {
          if (item !== undefined && item.action !== undefined && item.count < 3) {
            console.log('PROPERTY optParams?? ', item.action.hasOwnProperty('optParams'));

            // let optParams = {};
            // if (item.action.optParams !== null && item.action.optParams !== undefined) {
            //     optParams = {sopi: {count:(item.action.optParams) ? }};
            // }
            const resItem = Object.assign({}, item, <Request> { count: item.count + 1, error: error });
            this.store.dispatch(resItem.action);
            console.log('RM:: checkRequest :: QUERY :: FEHLER :: count<3');
          } else if (item !== undefined && item.action !== undefined) {
            const resItem = Object.assign({}, item, <Request> { count: item.count + 1, error: error });
            console.log('RM:: checkRequest :: QUERY :: FEHLER :: count>=3');
            this.store.dispatch(new actions.QueryFailedAddAction(resItem.key, resItem.action, resItem.method, resItem.type, resItem.date, resItem.error));
            this.store.dispatch(new actions.QueryQueueNextAction());
            const x = new actions.QueryQueueNextAction();
          }
        }
      }

      if (this.queryStack.values().length === 0) {
        console.log('RM:: checkRequest :: QUERY :: Stack === 0');
        this.checkQueue();
      }
    } else {
      // COMMAND
      // -------
      if (type === RequestType.Erfolgreich) {
        console.log('RM:: checkRequest :: COMMAND :: ERFOLGREICH');
        this.store.dispatch(new actions.CommandStackRemoveAction(key));
        this.store.dispatch(new actions.CommandQueueNextAction());
      }

      if (type === RequestType.Fehler) {
        console.log('ERROR', error);
        console.log('RM:: checkRequest :: COMMAND :: FEHLER', key);
        if (error.status === 400) {
          // FEHLERHAFTER REQUEST

        }
        const item = this.commandStack.item(key);
        console.log('PROPERTY optParams?? ', item.action.hasOwnProperty('optParams'));

        // if (item !== undefined && item.action !== undefined) {
        //     this.store.dispatch(new actions.CommandStackRemoveAction(item.key));
        // }
        // if (item !== undefined && item.action !== undefined && item.count < 3) {
        //     const resItem = Object.assign({}, item, <Request> { count: item.count + 1, error: error });
        //     console.log('RM:: checkRequest :: COMMAND :: FEHLER :: count<3');
        //     this.store.dispatch(resItem.action);
        // } else if (item !== undefined && item.action !== undefined) {
        //     const resItem = Object.assign({}, item, <Request> { count: item.count + 1, error: error });
        //     console.log('RM:: checkRequest :: COMMAND :: FEHLER :: count>=3');
        //     this.store.dispatch(new actions.CommandFailedAddAction(resItem.key, resItem.action, resItem.method, resItem.type, resItem.date, resItem.error));
        //     this.store.dispatch(new actions.CommandQueueNextAction());
        // }
      }
    }
    if (this.commandStack.values().length === 0 && this.commandQueue.length === 0) {
      console.log('RM:: checkRequest :: checkQueue');
      this.checkQueue();
    }
  }

  public enableService() {
    this.enabled$.next(true);
  }

  public disableService() {
    this.enabled$.next(false);
  }

  public isEnabled$(): Observable<boolean> {
    return this.enabled$.asObservable();
  }

  // Diese Funktion wird von allen Refresh's ausgelöst
  public clearQueries() {
    console.log('RM:: clearQueries');
    this.checkQueue();
  }

  private onlineLogik(key: string, action: Action, method: RequestMethod, type: RequestType): boolean {
    if (method === RequestMethod.QUERY) {
      // QUERY
      // -----

      // CACHE ÜBER ANFRAGE DEAKTIVIERT
      if (action['optPayload'] !== undefined &&
          action['optPayload'] !== null &&
          action['optPayload']['ngrxClientManager'] !== undefined) {
        const config = <NgrxClientManagerConfig> action['optPayload']['ngrxClientManager'];
        if (!config.cache) {
          return true;
        }
      }


      // INFO:
      // GET Anfragen müssen nicht gesammelt werden. Es reicht, wenn es die Aktuelle gibt und
      // man weiß, wenn es danach nochmal angefagt werden soll
      // 1. Anfrage noch nicht auf Stack
      if (!this.queryStack.containsKey(key)) {
        console.log('RM:: onlineLogik :: QUERY :: QueryStackAddAction');
        this.store.dispatch(new actions.QueryStackAddAction(key, action, method, type, new Date()));
        return true;
      } else if (!this.queryQueue.containsKey(key)) {
        // 2. Anfrage schon auf Stack und noch nicht in der Queue
        console.log('RM:: onlineLogik :: QUERY :: QueryQueueAddAction');
        this.store.dispatch(new actions.QueryQueueAddAction(key, action, method, type, new Date()));
      }
      return false;
    } else {
      // COMMAND
      // -------

      // INFO
      // POST, PUT oder DELETE müssen immer gespeichert werden

      // 1. Command noch nicht auf dem Stack
      // if (!this.commandStack.containsKey(key)) {
      // TZ: geändert, damit die Commands immer die
      // in der aufgetretenen Reihenfolge ausgeführt werden
      if (this.commandStack.values().length === 0) {
        console.log('RM:: onlineLogik :: COMMAND :: CommandStackAddAction');
        this.store.dispatch(new actions.CommandStackAddAction(key, action, method, type, new Date()));
        return true;

      } else {
        console.log('RM:: onlineLogik :: COMMAND :: CommandQueueAddAction');
        this.store.dispatch(new actions.CommandQueueAddAction(key, action, method, type, new Date()));
        return false;
      }
    }
  }

  private offlineLogik(key: string, action: Action, method: RequestMethod, type: RequestType): boolean {

    if (method === RequestMethod.QUERY) {
      // QUERY
      // -----
      if (this.queryStack.values().length > 0) {
        console.log('RM:: offlineLogik :: QUERY :: QueryStackCleanUpAction');
        this.store.dispatch(new actions.QueryStackCleanUpAction());
      }

      // 2. Wenn die Anfrage noch nicht in der Queue ist wird sie sich gemerkt
      if (!this.queryQueue.containsKey(key)) {
        // this.queryQueue.add(key, request);
        console.log('RM:: offlineLogik :: QUERY :: QueryQueueAddAction');
        this.store.dispatch(new actions.QueryQueueAddAction(key, action, method, type, new Date()));
      }
    } else {
      // COMMAND
      // -------
      if (this.commandStack.values().length > 0) {
        console.log('RM:: offlineLogik :: COMMAND :: CommandStackCleanUpAction');
        this.store.dispatch(new actions.CommandStackCleanUpAction());
      }

      // Falls vorhanden, alten request in die Queue schreiben
      // (Wenn er schon erfolgreich gewesen wäre, wäre er nicht mehr hier)
      // if (this.commandStack.containsKey(key)) {
      //     // const commandFromStack = this.commandStack.item(key);
      //     // this.store.dispatch(new actions.CommandQueueAddAction(commandFromStack.key, commandFromStack.action, commandFromStack.method, commandFromStack.type));
      //     // this.store.dispatch(new actions.CommandStackRemoveAction(commandFromStack.key));
      // }

      console.log('RM:: offlineLogik :: COMMAND :: CommandQueueAddAction');
      this.store.dispatch(new actions.CommandQueueAddAction(key, action, method, type, new Date()));
    }

    return false;
  }

  private checkQueue() {
    console.log('RM:: checkQueue');
    this.store.dispatch(new actions.QueryQueueNextAction());
    this.store.dispatch(new actions.CommandQueueNextAction());
  }
}
