import { Component, AfterViewInit, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, filter, map, pairwise, share, throttleTime } from 'rxjs/operators';
import { StyleVarDirection } from '../../utils/enums/style-vars.enum';
import { WindowService } from '../../utils/services/window/window.service';
@Component({
  selector: 'app-show-text',
  templateUrl: './show-text.component.html',
  styleUrls: ['./show-text.component.scss']
})
export class ShowTextComponent {
  @Input() description: string;

  constructor(private windowsService: WindowService) { }
}
