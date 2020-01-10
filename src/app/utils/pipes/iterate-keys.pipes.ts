import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'IterateKeys'
})
export class IterateKeys implements PipeTransform {
  transform(value): any {
    return value ? Object.keys(value) : null;
  }
}
