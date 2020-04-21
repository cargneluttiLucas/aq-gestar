import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export function greaterThanTodayValidator(control: AbstractControl): { [key: string]: boolean } | null {
    var issameorafter = moment('2017-10-10').isSameOrAfter('2017-10-15', 'day');
    const today = moment(new Date());
    if (control.value && !control.value.isSameOrAfter(today, 'day')) {
        return { 'greaterThanTodayValidator': true };
    }
    return null;
}

export function greaterThanDateValidator(date: any): (control: AbstractControl) => { [key: string]: boolean } | null {
    if (date){
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value && !control.value.isSameOrAfter(date, 'day')) {
                return { 'greaterThanDateValidator': true };
            }
            return null;
        }
    } else {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            return null;
        }
    }
    
}