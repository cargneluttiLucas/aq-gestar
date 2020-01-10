import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DateMask'
})
export class DatePipe implements PipeTransform {
  transform(value): any {
    if (!value || value.length !== 8) {
      return value;
    }
    return  `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
  }
}
