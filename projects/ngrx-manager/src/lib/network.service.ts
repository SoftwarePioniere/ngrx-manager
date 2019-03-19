import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Network} from '@ionic-native/network/ngx';
import {Platform} from '@ionic/angular';

export enum ConnectionStatus {
    Online,
    Offline
}

@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);
    private statusBoolean: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private network: Network, private platform: Platform) {
        this.platform.ready().then(() => {
            if (this.platform != null && (this.platform.is('cordova'))) {
                // CORDOVA
                this.initializeNetworkEvents();
                const status = this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
                this.status.next(status);
                this.statusBoolean.next(status === ConnectionStatus.Online);
            } else {
                // WEB
                this.updateNetworkStatus(ConnectionStatus.Online);
                this.initializeNetworkWebEvents();
            }
        });
    }


    initializeNetworkEvents() {
        console.log(this.network);
        if (this.network) {
            this.network.onDisconnect().subscribe((data) => {
                console.log('change Network Offline: ', data);
                // if (this.status.getValue() === ConnectionStatus.Online) {
                    this.updateNetworkStatus(ConnectionStatus.Offline);
                // }
            });

            this.network.onConnect().subscribe((data) => {
                console.log('change Network Online: ', data);
                // if (this.status.getValue() === ConnectionStatus.Offline) {
                    this.updateNetworkStatus(ConnectionStatus.Online);
                // }
            });

            this.network.onchange().subscribe((data) => {
                console.log('change Network: ', data);
            });
        } else {
            console.log('Network Plugin fehlt');
        }
    }

    initializeNetworkWebEvents() {
        window.addEventListener('online', function() { this.updateNetworkStatus(ConnectionStatus.Online); console.log('online web'); }.bind(this));
        window.addEventListener('offline',  function() { this.updateNetworkStatus(ConnectionStatus.Offline); console.log('offline web'); }.bind(this));
    }


    updateNetworkStatus(status: ConnectionStatus) {
        console.log(status);
        this.status.next(status);
        this.statusBoolean.next(status === ConnectionStatus.Online);
    }

    public onNetworkChange(): Observable<ConnectionStatus> {
        return this.status.asObservable();
    }

    public isOnline(): Observable<boolean> {
        return this.statusBoolean.asObservable();
    }

    public getCurrentNetworkStatus(): ConnectionStatus {
        return this.status.getValue();
    }
}
