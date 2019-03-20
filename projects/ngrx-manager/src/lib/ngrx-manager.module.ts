import {CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule} from '@angular/core';
import {ActionReducer, StoreModule} from '@ngrx/store';
import {reducers, SopiNgrxManagerFeature} from './reducer';
import {EffectsModule} from '@ngrx/effects';
import {LocalStorageConfig, localStorageSync} from 'ngrx-store-localstorage';
import {NgrxManagerService} from './ngrx-manager.service';
import {NetworkService} from './network.service';
import {NgrxManagerEffects} from './effects';
import {SyncDialogComponent} from './sync-dialog/sync-dialog.component';
import {NgrxManagerRoutingModule} from './ngrx-manager-routing.module';
import {CommonModule} from '@angular/common';
import {MomentModule} from 'ngx-moment';
import {RemoveDotsModule} from "./pipes/remove-dots/remove-dots.module";

export function sessionStorage(reducer: ActionReducer<any>): ActionReducer<any> {

  const config: LocalStorageConfig = {
    keys: [
      'ngrxManager'
    ],
    rehydrate: true,
    removeOnUndefined: true
  };

  return localStorageSync(config)(reducer);
}

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(SopiNgrxManagerFeature, reducers, {metaReducers: [sessionStorage]}),
    EffectsModule.forFeature([
      NgrxManagerEffects
    ]),
    NgrxManagerRoutingModule,
    MomentModule,
    RemoveDotsModule
  ],
  declarations: [
    SyncDialogComponent
  ],
  exports: [
    SyncDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NgrxManagerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgrxManagerModule,
      providers: [
        NetworkService,
        NgrxManagerService,
      ]
    };
  }
}
