import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

@Component({
  selector: 'app-checkboxs',
  templateUrl: './checkboxs.component.html',
  styleUrls: ['./checkboxs.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ContainerCheckboxsComponent),
    multi: true
  }]
})
export class ContainerCheckboxsComponent implements  ControlValueAccessor, OnInit {
  @Input() listCheckboxs: any[] = [];
  @Input() fatherCheckbox: any = null;
  @Input() text = '';
  @Output() checkboxChange: EventEmitter<any> = new EventEmitter<any>();
  formControl = new FormControl();
  private propagateChange = (_: any) => { };

  ngOnInit(): void {
    this.listCheckboxs.forEach((checkbox) => {
      this.initParents(checkbox);
    });

  }

  initParents(checkbox) {
    if (checkbox.listCheckboxs && checkbox.listCheckboxs.length) {
      checkbox.listCheckboxs.forEach((child) => {
        child.parent = checkbox;
        this.checkFather(checkbox);
        if (child.listCheckboxs && child.listCheckboxs.length) {
          this.initParents(child);
        }
      });
    }
  }

  checkSelected(event) {
    let sendEvent;
    this.checkChildrens(event);
    this.checkFather(this.fatherCheckbox);
    if (event) {
      sendEvent = event;
      delete sendEvent.parent;
      this.checkboxChange.emit(sendEvent);
    }
  }

  checkFather(fatherCheckbox: any): void {
    if (fatherCheckbox && !fatherCheckbox.disabled) {
      fatherCheckbox.selected = false;
      fatherCheckbox.indeterminate = false;
      let selectedCount = 0;
      let disabledCount = 0;
      let indeterminateCount = 0;
      fatherCheckbox.listCheckboxs.forEach((child) => {
        if (child.disabled) {
          disabledCount += 1;
        } else if (child.indeterminate) {
          indeterminateCount += 1;
        } else if (child.selected === true) {
          selectedCount += 1;
        }
      });
      let fatherLength = fatherCheckbox.listCheckboxs.length;
      if (disabledCount > 0) {
        fatherLength -= disabledCount;
      }
      if (selectedCount > 0 && selectedCount === fatherLength) {
        fatherCheckbox.selected = true;
        fatherCheckbox.indeterminate = false;
      } else if (indeterminateCount > 0 || selectedCount > 0) {
        fatherCheckbox.selected = false;
        fatherCheckbox.indeterminate = true;
      }
      if (fatherCheckbox.parent) {
        this.checkFather(fatherCheckbox.parent);
      }
    }
  }

  checkChildrens(checkbox, isChildren: boolean = false): void {
    !isChildren ? checkbox.selected = !checkbox.selected : checkbox.selected = checkbox.selected;
    checkbox.indeterminate = false;
    if (checkbox.listCheckboxs && checkbox.listCheckboxs.length > 0) {
      checkbox.listCheckboxs.forEach((checkboxChildren) => {

        if (checkbox.selected && !checkboxChildren.disabled) {
          checkboxChildren.selected = true;
          checkboxChildren.indeterminate = false;

          if (checkboxChildren.listCheckboxs && checkboxChildren.listCheckboxs.length > 0) {
            this.checkChildrens(checkboxChildren, true);
          }
        } else if (!checkbox.selected && !checkboxChildren.disabled) {
          checkboxChildren.selected = false;
          checkboxChildren.indeterminate = false;

          if (checkboxChildren.listCheckboxs && checkboxChildren.listCheckboxs.length > 0) {
            this.checkChildrens(checkboxChildren, true);
          }
        }
      });

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
      this.listCheckboxs = obj;
    }
  }
}
