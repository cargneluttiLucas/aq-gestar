import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-main-object',
  templateUrl: './main-object.component.html',
  styleUrls: ['./main-object.component.scss']
})
export class MainObjectsComponent implements OnInit {

  @Input() selectedFormControl: FormControl;
  @Input() isSession: string;
  @Input() text: string;
  @Input() dispatchHint: string;
  @Input() id: string;
  @Input() mainObjects: any[] = [];

  @Input() mainObjectsSelected = { id: null, description: '', disabled: false };
  @Output() mainObjectsSelectedData = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if (!this.selectedFormControl) {
      this.selectedFormControl = new FormControl('');
    }
  }

  itemSelected(event) {
    this.mainObjectsSelected = event;
    this.selectedFormControl.setValue(event.description);
    this.mainObjectsSelectedData.emit(this.mainObjectsSelected);
  }

  handlerError(event) {
    console.log('handlerError' + this.text, event);
  }
}
