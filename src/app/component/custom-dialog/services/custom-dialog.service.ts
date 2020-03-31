import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalDialogService } from '../../../utils/services/modal/modal-dialog.service';

@Injectable()
export class NGZCustomDialogService {

  constructor(private modalService: ModalDialogService) { }

  showDialog(templateComponent: any, afterClose: Subject<any>, titleDialog?: string, options?: ICustomDialogOptions): void {
    this.modalService.openDialog(NGZCustomDialogService, {
      childComponent: CustomDialogComponent,
      data: {
        templateComponent,
        titleDialog,
        options
      },
      onAfterClose: afterClose,
      isOverlay: true
    });
  }

  closeDialog(): void {
    this.modalService.close();
  }
}

export interface ICustomDialogOptions {
  onActionClose: Subject<any>;
  disabledClose?: boolean;
  data?: any;
}
