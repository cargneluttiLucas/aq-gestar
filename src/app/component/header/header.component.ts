import { Component, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, filter, map, pairwise, share, throttleTime } from 'rxjs/operators';
import { StyleVarDirection } from '../../utils/enums/style-vars.enum';
import { WindowService } from '../../utils/services/window/window.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
  isVisible: boolean;

  constructor(private windowsService: WindowService) {}

  ngAfterViewInit() {
    const scroll$ = fromEvent(this.windowsService.nativeWindow, 'scroll').pipe(
      throttleTime(10),
      map(() => this.windowsService.nativeWindow.pageYOffset),
      pairwise(),
      map(([y1, y2]): StyleVarDirection => (y2 < y1 ? StyleVarDirection.UP : StyleVarDirection.DOWN)),
      distinctUntilChanged(),
      share()
    );

    const goingUp$ = scroll$.pipe(filter(direction => direction === StyleVarDirection.UP));

    const goingDown$ = scroll$.pipe(filter(direction => direction === StyleVarDirection.DOWN));

    goingUp$.subscribe(() => (this.isVisible = true));
    goingDown$.subscribe(() => (this.isVisible = false));
  }
}
