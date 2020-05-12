import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { filter, map } from 'rxjs/operators';

function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string' && control.value !== '') {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

@Component({
  selector: 'app-keyword',
  templateUrl: './keyword.component.html',
  styleUrls: ['./keyword.component.scss']
})
export class KeywordComponent implements OnInit {

  @Input() placeHolder: string;
  @Input() control: FormControl;
  @Input() keywords: any[] = [];

  filteredKeywords: any[] = [];

  constructor() { }

  ngOnInit() {
    this.control.setValidators(autocompleteObjectValidator());
    
    this.control
      .valueChanges
      .pipe(
        filter((str) => typeof str === 'string'),
        map(description => description ? this._filter(description) : this.keywords.slice())
      ).subscribe((result) => {
        this.filteredKeywords = result;
      });;
  }

  private _filter(description: string){
    const filterValue = description.toLowerCase();

    return this.keywords.filter(option => option.description.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(user): string | undefined {
    return user ? user.description : undefined;
  }
}

