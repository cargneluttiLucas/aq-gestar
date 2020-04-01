import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DialogComponent } from '../dialog.component';
import { ModalDialogService } from 'src/app/utils';
import { IContainerIconData } from '../../container-icon/models/container-icon-data.interface';

@Injectable()
export class DialogService {

  constructor(private modalService: ModalDialogService) { }

  showDialog(dataComponent: IDialogData, afterClose: Subject<any>): void {
    this.modalService.openDialog(DialogComponent, {
      childComponent: DialogComponent,
      data: dataComponent,
      onAfterClose: afterClose,
      isOverlay: true
    });
  }

  closeDialog(): void {
    this.modalService.close();
  }
}

export interface IDialogData {
  contentIcon?: IContainerIconData;
  title?: string;
  paragraph?: string;
  disabledClose?: boolean;
  actionsButtons?: IModalDialogButton[];
  onAction?: Subject<any>;
  isDesktop?: boolean;
}

export interface IModalDialogButton {
  text: string;
  onAction?: Subject<any>;
  actionsButtons?: boolean;
  data?: any;
}

export const ContentIconsType = {
  WARNING: {
    iconName: 'icon-alert',
    colorIcon: '#FFFFFF',
    colorBackground: '#FFB30F'
  },
  ERROR: {
    iconName: 'icon-cross',
    colorIcon: '#FFFFFF',
    colorBackground: '#D10000'
  },
  SUCCESS: {
    iconName: 'icon-check',
    colorIcon: '#FFFFFF',
    colorBackground: '#00A67A'
  }
};
