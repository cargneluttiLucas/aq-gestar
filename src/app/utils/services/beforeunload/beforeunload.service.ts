import { Injectable } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';
import { WindowService } from '../window/window.service';

@Injectable({
    providedIn: 'root'
})
export class BeforeunloadService {

    private beforeunloadSubscription: Subscription = new Subscription();

    constructor(
        private windowsService: WindowService) {
    }

    public beforeunload(): Observable<any> {
        const subject = new Subject<any>();
        // tslint:disable-next-line: only-arrow-functions
        this.beforeunloadSubscription = this.windowsService.nativeWindow.addEventListener('beforeunload', function(e) {
            subject.next(e);
        });
        return subject.asObservable();
    }

    public beforeunloadUnsubscription(): void {
        this.beforeunloadSubscription.unsubscribe();
      }
}
