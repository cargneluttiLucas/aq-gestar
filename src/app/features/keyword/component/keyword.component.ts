import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { FormControl, ValidatorFn, AbstractControl } from '@angular/forms';

function selectObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value.id) {
      return { 'mandatoryField': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

@Component({
  selector: 'app-keyword',
  templateUrl: './keyword.component.html',
  styleUrls: ['./keyword.component.scss']
})
export class KeywordComponent implements OnInit, OnChanges {

  @Input() placeHolder: string;
  @Input() control: FormControl;
  @Input() keywords: any[] = [];
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;

  emptyOption = {id: null, description: null, disabled: false};

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(){
    if (this.disabled) {
      this.control.disable();
    }
    if(this.required){
      this.control.setValidators(selectObjectValidator());
    }
  }

  compareObjects(o1: any, o2: any) {
    return o1.id == o2.id;
  }
}

