import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface CheckSelected {
  id: number;
  disabled: boolean;
  indeterminate: boolean;
  selected: boolean;
  text: string;
  listCheckboxs?: any;
}

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
  }]
})

export class  CheckboxComponent implements ControlValueAccessor {
  @Input() checkbox: any = { selected: false, disabled: false, text: '', indeterminate: false, listCheckboxs: [] };
  @Input() index: number;
  @Output() checkboxChecked = new EventEmitter();
  private propagateChange = (_: any) => { };

  constructor() {
  }

  checkSelected(event) {
    if (!this.checkbox.disabled) {
      this.checkboxChange(event, true);
    }
  }

  checkboxChange(event: CheckSelected, isCheckSelected: boolean = false) {
    if (!this.checkbox.disabled) {
      if (isCheckSelected) {
        this.checkboxChecked.emit(this.checkbox);
      } else {
        const sendObject = {
          object: event
        };
        this.checkboxChecked.emit(sendObject);
      }
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    if (obj) {
      this.checkbox = obj;
    }
  }

}
