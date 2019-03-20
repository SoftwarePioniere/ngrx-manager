import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'removeDots'})
export class RemoveDotsPipe implements PipeTransform {
    transform(value: any) {
        if(value === null) {
            return value;
        }
        return value.replace('.', '');
    }
}

