import { tap, finalize } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { LoggerService } from '../utils/services/logger.service';
import { ApplicationRef, Injector, Inject, ComponentFactoryResolver, PLATFORM_ID, EmbeddedViewRef } from '@angular/core';
import { NavigatorService } from 'src/app/utils';
import { SpinnerComponent } from 'src/app/component/spinner/spinner.component';
import { Router } from '@angular/router';

export class TimingInterceptor implements HttpInterceptor {
  componentFactory;

  reqList: any[] = [];

  constructor(
    private router: Router,
    private appRef: ApplicationRef,
    private injector: Injector,
    private navigatorService: NavigatorService,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    let ok: string;
    this.reqList.push({ url: req.url, pending: true });

    // extend server response observable with logging
    return next.handle(req)
      .pipe(
        tap((event) => {
          this.showSpinner(true);
          // Succeeds when there is a response; ignore other events
          ok = event instanceof HttpResponse ? 'succeeded' : '';
          // Operation failed; error is an HttpErrorResponse
          // ok = error instanceof HttpResponse ? 'failed' : '';
        }

        ),
        // Log when response observable either completes or errors
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${req.method} "${req.urlWithParams}"
             ${ok} in ${elapsed} ms.`;
          this.showSpinner(false, req.urlWithParams);
          LoggerService.log(msg);
        })
      );
  }

  private showSpinner(flag: boolean, url?: string) {
    if (flag && !this.componentFactory) {
      this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(SpinnerComponent).create(this.injector);
      this.appRef.attachView(this.componentFactory.hostView);
      const domElem = (this.componentFactory.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
    }
    if (!flag && this.componentFactory) {
      this.reqList.forEach((item, index) => {
        if (item.url === url && item.pending) {
          this.reqList[index].pending = false;
        }
      });
    }
    if (!this.reqList[this.reqList.length - 1].pending) {
      this.appRef.detachView(this.componentFactory.hostView);
      this.componentFactory.destroy();
    }
  }
}
