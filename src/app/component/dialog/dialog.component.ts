import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { IContainerIconData } from '../container-icon/models/container-icon-data.interface';
import { IModalDialogButton } from './services/dialog.service';
import { IModalDialogOptions } from '../../utils/services/modal/models/modal-dialog.interface';
import { Browser } from '../../utils/util/browser/browser';
import { Subject, Subscription } from 'rxjs';
import {
  WindowService,
  DocumentService,
  KeypressService,
  ModalDialogService,
  NavigatorService,
  KeyPressType
} from '../../utils/index';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, IModalDialogOptions<any>, AfterViewInit, OnDestroy {
  browser = new Browser(this.windowService);
  contentIcon: IContainerIconData;
  title: string;
  paragraph: string;
  actionsButtons: IModalDialogButton[] = [];
  onAfterClose: Subject<any>;
  // subjet generico
  onAction: Subject<any>;
  count = 0;
  isMobile = false;
  maxWidthCard = '360px';
  lengthButtons = 0;

  styleArray = { 'min-width': '360px', position: 'absolute' };
  styleArrayMobile = { 'min-width': '296px', position: 'absolute' };
  childComponent?: any;

  isDesktop: boolean;
  data: any;
  placeOnTop: boolean;
  outputData: Subject<any>;
  isOverlay: boolean;
  eventBody: any;
  disabledClose = false;
  keypressSubscription: Subscription = new Subscription();

  constructor(
    private documentService: DocumentService,
    private windowService: WindowService,
    public modalService: ModalDialogService,
    private deviceDetector: NavigatorService,
    private keypressService: KeypressService) {
  }

  ngOnInit() {
    this.contentIcon = this.data.contentIcon;
    this.title = this.data.title;
    this.paragraph = this.data.paragraph;
    this.actionsButtons = this.data.actionsButtons;
    this.disabledClose = this.data.disabledClose;
    this.onAction = this.data.onAction;
    this.isDesktop = this.data.isDesktop;
    this.onAfterClose = this.onAfterClose;

    if (!this.isDesktop) {
      this.isMobile = this.deviceDetector.isMobile;
    }

    if (this.isMobile) {
      this.maxWidthCard = '296px';
    }

    if (!this.contentIcon) {
      this.styleArray = { 'min-width': '360px', position: 'absolute' };
    }

    if (this.deviceDetector.isBrowser) {
      this.keyboardEvents();
    }

  }

  ngAfterViewInit() {
    this.setModal();
    this.lengthButtons = this.actionsButtons.length;
  }

  setModal(): void {

    this.documentService.nativeDocument.body.style.overflow = 'hidden';
    (this.documentService.nativeDocument.querySelector('dialog') as HTMLElement).style.alignItems = 'center';
    (this.documentService.nativeDocument.querySelector('dialog') as HTMLElement).style.border = '0';
    (this.documentService.nativeDocument.querySelector('dialog') as HTMLElement).style.display = 'flex';
    (this.documentService.nativeDocument.querySelector('dialog') as HTMLElement).style.height = 'calc(100vh - 10px)';
    (this.documentService.nativeDocument.querySelector('dialog') as HTMLElement).style.justifyContent = 'center';
    (this.documentService.nativeDocument.querySelector('dialog') as HTMLElement).style.left =
      this.browser.getBrowser() === 'ie' ? '-10%' : '0';
    (this.documentService.nativeDocument.querySelector('dialog') as HTMLElement).style.overflow = 'hidden';
    (this.documentService.nativeDocument.querySelector('dialog') as HTMLElement).style.position = 'fixed';
    (this.documentService.nativeDocument.querySelector('dialog') as HTMLElement).style.right = '0';
    (this.documentService.nativeDocument.querySelector('dialog') as HTMLElement).style.top =
      this.browser.getBrowser() === 'ie' ? '-10%' : '0';
    (this.documentService.nativeDocument.querySelector('dialog') as HTMLElement).style.width = '100%';
    (this.documentService.nativeDocument.querySelector('dialog') as HTMLElement).style.zIndex = '810';

  }

  clickOutside(): void {
    this.closeModal();
    if (this.onAfterClose) {
      this.onAfterClose.next();
    }
  }

  eventAction(actionButtonAux: IModalDialogButton): void {
    this.closeModal();
    if (this.onAction) {
      this.onAction.next(actionButtonAux);
    }
    if (actionButtonAux.onAction) {
      actionButtonAux.onAction.next();
    }
  }

  closeModal(): void {
    this.modalService.close();
  }

  ngOnDestroy(): void {
    this.keypressSubscription.unsubscribe();
    this.keypressService.keypressUnsubscription();
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
