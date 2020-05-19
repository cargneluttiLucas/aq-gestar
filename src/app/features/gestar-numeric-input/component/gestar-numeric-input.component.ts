import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare const Inputmask: any;

@Component({
  selector: 'app-gestar-numeric-input',
  templateUrl: './gestar-numeric-input.component.html',
  styleUrls: ['./gestar-numeric-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: GestarNumericInputComponent,
    multi: true
  }]
})
export class GestarNumericInputComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  @Input() placeHolder: string;
  @Input() required = false;
  @ViewChild('auxiliarInput',  {static: false}) auxiliarInput: any;
  onChange;

  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit(){
    Inputmask(
      'numeric',
      {
          autoGroup: true,
          rightAlign: false,
          radixPoint: ',',
          groupSeparator: '.',
          unmaskAsNumber: true,
      }
    ).mask(this.auxiliarInput);
  }

  writeValue(value) {
    if (this.auxiliarInput && value){
      this.auxiliarInput.nativeElement.value = value;
    }
  }

  _onChange(value){
    this.onChange(this.auxiliarInput.nativeElement.inputmask.unmaskedvalue());
  }

  registerOnChange(fn) { this.onChange = fn;  }

  registerOnTouched(fn) {  }

}
