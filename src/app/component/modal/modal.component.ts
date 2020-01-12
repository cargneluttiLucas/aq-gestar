import { Component, OnDestroy, OnInit, Input, ElementRef, AfterContentInit } from '@angular/core';
import { ModalService } from './service/modal.service';
import { DocumentService } from '../../utils/services/document/document.service';
import { NavigatorService } from '../../utils/services/navigator/navigator.service';

@Component({
  selector: 'app-modal',
  template: `<div class="container-modal">
            <div class="container-modal__body">
                <ng-content></ng-content>
            </div>
        </div>
        <div class="modal-background"></div>`
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  private element: any;

  constructor(
    private modalService: ModalService,
    private el: ElementRef,
    private navigationService: NavigatorService,
    private documentService: DocumentService
  ) {
    this.element = this.el.nativeElement;
  }

  ngOnInit() {
    // tslint:disable-next-line: no-this-assignment
    const modal = this;
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    if (this.navigationService.isBrowser) {
      this.documentService.nativeDocument.body.appendChild(this.element);

      this.modalService.add(this);
    }

  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }

  open(): void {
    this.element.style.display = 'block';
    this.documentService.nativeDocument.body.classList.add('modal-open');
  }

  close(): void {
    this.element.style.display = 'none';
    this.documentService.nativeDocument.body.classList.remove('modal-open');
  }
}
