import { Component, Input, OnChanges } from '@angular/core';

const REGEXP = /;/;

@Component({
  selector: 'app-show-text',
  templateUrl: './show-text.component.html',
  styleUrls: ['./show-text.component.scss']
})
export class ShowTextComponent implements OnChanges {
  @Input() description: string;

  historicalDescription: string[] = [];

  ngOnChanges() {
    let index = 0;
    if (this.description) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.description.length; i = i + 1) {
        if (REGEXP.test(this.description[i])) {
          const aux = this.description.substr(index, i - index);
          this.historicalDescription.push(aux.replace(/;/g, ' '));
          index = i;
        }
      }

      if (this.historicalDescription.length === 0) {
        this.historicalDescription.push(this.description);
      }
    }

  }
}
