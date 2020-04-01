import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalDialogService } from '../../../utils/services/modal/modal-dialog.service';
import { CustomDialogComponent } from '../custom-dialog.component';

@Injectable()
export class CustomDialogService {

  constructor(private modalService: ModalDialogService) { }

  showDialog(templateComponent: any, afterClose: Subject<any>, titleDialog?: string, options?: ICustomDialogOptions): void {
    this.modalService.openDialog(CustomDialogService, {
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
