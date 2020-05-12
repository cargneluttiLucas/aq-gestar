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
  selector: 'app-main-object',
  templateUrl: './main-object.component.html',
  styleUrls: ['./main-object.component.scss']
})
export class MainObjectsComponent implements OnInit {

  @Input() placeHolder: string;
  @Input() control: FormControl;
  @Input() mainObjects: any[] = [];

  filteredMainObjects: any[] = [];

  constructor() { }

  ngOnInit() {
    this.control.setValidators(autocompleteObjectValidator());
    
    this.control
      .valueChanges
      .pipe(
        filter((str) => typeof str === 'string'),
        map(description => description ? this._filter(description) : this.mainObjects.slice())
      ).subscribe((result) => {
        this.filteredMainObjects = result;
      });;
  }

  private _filter(description: string){
    const filterValue = description.toLowerCase();

    return this.mainObjects.filter(option => option.description.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(user): string | undefined {
    return user ? user.description : undefined;
  }
}
