import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  @Input() text: string;
  @Input() UserFormControl: FormControl;
  @Input() items: any;
  @Input() minLength: number;


  itemSelectedPredictive(event) {}
}
