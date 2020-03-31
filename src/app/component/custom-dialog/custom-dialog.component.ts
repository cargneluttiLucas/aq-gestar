import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef, EmbeddedViewRef,
  Inject, Injector, OnDestroy,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import { ICustomDialogOptions } from './services/custom-dialog.service';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { map, pairwise, filter } from 'rxjs/operators';
import { IModalDialogOptions } from '../../utils/services/modal/models/modal-dialog.interface';
import { Browser } from '../../utils/util/browser/browser';
import {
  ModalDialogService,
  DocumentService,
  WindowService,
  NavigatorService,
  KeypressService,
  KeyPressType
} from '../../utils/index';

@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.scss']
})
export class NGZCustomDialogComponent implements OnInit, OnDestroy, IModalDialogOptions<any>, AfterViewInit {
  isPostbackSafari = false;
  browser = new Browser(this.windowService);
  isMobile = false;
  styleArray = { 'max-width': 'calc(100% - 32px)', width: '600px', position: 'absolute' };
  styleArrayMobile =
    {  width: '100%', 'max-width': 'calc(100% - 32px)', position: 'absolute' };
  maxWidthCard = 'display: flex; justify-content: center;';
  marginCardMobile = '0 24px';
  titleDialog: string;
  scrollBody;
  marginTopTitle = 10;
  heightTitle = 30;
  isLineFinish = false;
  disabledClose = false;
  suscriptionScroll: Subscription;
  childComponent: any;
  data: any;
  placeOnTop: boolean;
  outputData: Subject<any>;
  onAfterClose: Subject<any>;
  isOverlay: boolean;
  eventBody: any;
  keypressSubscription: Subscription = new Subscription();

  constructor(
    private documentService: DocumentService,
    private viewContainerRef: ViewContainerRef,
    private keypressService: KeypressService,
    private windowService: WindowService,
    private deviceDetector: NavigatorService,
    @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver,
    private modalService: ModalDialogService) {
    this.isMobile = this.deviceDetector.isMobile;
  }

  ngOnInit() {
    this.dialogInit();
    if (this.isMobile) {
      this.maxWidthCard = '296px';
    }
    this.keyboardEvents();
  }

  ngAfterViewInit() {
    this.setModal();
  }

  ngOnDestroy(): void {
    if (this.suscriptionScroll) {
      this.suscriptionScroll.unsubscribe();
    }
    if (this.keypressSubscription) {
      this.keypressSubscription.unsubscribe();
    }
    this.keypressService.keypressUnsubscription();
  }

  setModal(): void {
    const browser = new Browser(this.windowService);
    this.documentService.nativeDocument.body.style.overflow = 'hidden';
    (this.documentService.nativeDocument.querySelector('z-custom-dialog') as HTMLElement).style.alignItems = 'center';
    (this.documentService.nativeDocument.querySelector('z-custom-dialog') as HTMLElement).style.border = '0';
    (this.documentService.nativeDocument.querySelector('z-custom-dialog') as HTMLElement).style.display = 'flex';
    (this.documentService.nativeDocument.querySelector('z-custom-dialog') as HTMLElement).style.height = 'calc(100vh - 10px)';
    (this.documentService.nativeDocument.querySelector('z-custom-dialog') as HTMLElement).style.justifyContent = 'center';
    (this.documentService.nativeDocument.querySelector('z-custom-dialog') as HTMLElement).style.left =
      browser.getBrowser() === 'ie' ? '-10%' : '0';
    (this.documentService.nativeDocument.querySelector('z-custom-dialog') as HTMLElement).style.overflow = 'hidden';
    (this.documentService.nativeDocument.querySelector('z-custom-dialog') as HTMLElement).style.position = 'fixed';
    (this.documentService.nativeDocument.querySelector('z-custom-dialog') as HTMLElement).style.right = '0';
    (this.documentService.nativeDocument.querySelector('z-custom-dialog') as HTMLElement).style.top =
      browser.getBrowser() === 'ie' ? '-10%' : '0';
    (this.documentService.nativeDocument.querySelector('z-custom-dialog') as HTMLElement).style.width = '100%';
    (this.documentService.nativeDocument.querySelector('z-custom-dialog') as HTMLElement).style.zIndex = '830';

    const bodyElement = (this.documentService.nativeDocument.querySelector('body') as HTMLElement);
    this.eventBody = fromEvent(bodyElement, 'keydown');
  }

  clickOutside(): void {
    if (this.browser.getBrowser() === 'safari' && !this.isPostbackSafari) {
      this.isPostbackSafari = true;
      return;
    }

    this.closeModal();
  }

  closeModal(): void {
    this.onAfterClose.next();
    this.modalService.close();
  }

  dialogInit(): void {
    const factory = this.componentFactoryResolver.resolveComponentFactory(this.data.templateComponent);
    const component = this.viewContainerRef.createComponent(factory) as ComponentRef<ICustomDialogOptions>;
    if (this.data.options) {
      component.instance.onActionClose = this.data.options.onActionClose;
      component.instance.data = this.data.options.data;
      this.disabledClose = this.data.options.disabledClose;
    }

    const domElem = (component.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    (this.documentService.nativeDocument.querySelector('.z-custom-modal-dialog__content__body') as HTMLElement).appendChild(domElem);

    if (this.data.titleDialog) {
      this.titleDialog = this.data.titleDialog;
      const bodyElement = (this.documentService.nativeDocument.querySelector('.z-custom-modal-dialog__content__body')) as HTMLElement;

      this.scrollBody = fromEvent(bodyElement, 'scroll');
      this.suscribeScroll();
    }
  }

  suscribeScroll(): void {
    this.suscriptionScroll = this.scrollBody.pipe(map((value: any) => value.target.scrollTop), pairwise())
      .subscribe((scrollValues) => {
        if (scrollValues[0] < scrollValues[1] && this.marginTopTitle !== 0) {
          this.marginTopTitle -= 2;
          this.heightTitle -= 1;
          this.isLineFinish = false;
        }
        if (scrollValues[0] > scrollValues[1] && this.marginTopTitle !== 10) {
          this.marginTopTitle += 2;
          this.heightTitle += 1;
          this.isLineFinish = false;
        }
        if (this.marginTopTitle === 0) {
          this.isLineFinish = true;
        }
      });
  }

  keyboardEvents() {
    this.keypressSubscription = this.keypressService.suscribeKeyPress().subscribe((response) => {
      if (response) {
        switch (response) {
          case KeyPressType.ENTER: {
            event.preventDefault();
            break;
          }
          case KeyPressType.ESCAPE: {
            this.closeModal();
            break;
          }
          case KeyPressType.SPACE: {
            event.preventDefault();
            break;
          }
          case KeyPressType.TAB: {
            event.preventDefault();
            break;
          }
          default: {
            break;
          }
        }
      }
    });
  }
}
