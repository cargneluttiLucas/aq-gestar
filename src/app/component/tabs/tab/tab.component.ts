import { Component, forwardRef, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ITab } from './tab.interface';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements ITab {
  @Input() title: string;
  @Input() disabled = false;
  @Input() isActive = false;
  @Input() isHidden = false;
}
