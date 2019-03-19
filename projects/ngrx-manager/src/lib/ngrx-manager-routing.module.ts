import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SyncDialogComponent} from './sync-dialog/sync-dialog.component';

const routes: Routes = [
    {path: 'sync-dialog', component: SyncDialogComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NgrxManagerRoutingModule {
}
