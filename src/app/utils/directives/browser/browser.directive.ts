import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { Browser } from '../../util/browser/browser';
import { WindowService } from '../../services/window/window.service';

@Directive({
  selector: '[appBrowser]'
})
export class BrowserDirective {
  constructor(private renderer: Renderer2, private element: ElementRef, private windowService: WindowService) {
    const browser = new Browser(this.windowService);
    this.renderer.addClass(element.nativeElement, `browser-${browser.getBrowser()}`);
  }
}
