import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RemoveDotsPipe} from './remove-dots.pipe';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [CommonModule],
    declarations: [RemoveDotsPipe],
    exports: [RemoveDotsPipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RemoveDotsModule {
}
