import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Subscription, fromEvent, Observable, Subject } from 'rxjs';
import { DocumentService } from '../document/document.service';
import { NavigatorService } from '../navigator/navigator.service';

@Injectable({
  providedIn: 'root'
})
export class KeypressService {

  private keypressSubscription: Subscription = new Subscription();

  constructor(
    private documentService: DocumentService,
    private navigationService: NavigatorService) {
  }

  public suscribeKeyPress(name?: string): Observable<any> {
    if (this.navigationService.isBrowser) {
      const subject = new Subject<any>();
      this.keypressSubscription = fromEvent(
        (this.documentService.nativeDocument.querySelector('body') as HTMLElement), 'keydown')
        .subscribe((event: KeyboardEvent) => {
          if (name && name === event.key) {
            subject.next(true);
          } else {
            subject.next(event.key);
          }
        });
      return subject.asObservable();
    }
  }

  // usar solamente cuando se necesita una sola.
  public keyPressEscape(): Observable<boolean> {
    return this.suscribeKeyPress('Escape');
  }

  public keyPressTab(): Observable<boolean> {
    return this.suscribeKeyPress('Tab');
  }

  public keyPressEnter(): Observable<boolean> {
    return this.suscribeKeyPress('Enter');
  }

  public keyPressSpace(): Observable<boolean> {
    return this.suscribeKeyPress(' ');
  }

  public keypressUnsubscription(): void {
    this.keypressSubscription.unsubscribe();
  }
}
