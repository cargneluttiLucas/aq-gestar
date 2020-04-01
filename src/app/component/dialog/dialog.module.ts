import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from '../card/card.module';
import { ButtonModule } from '../button/button.module';
import { UtilsModule, NavigatorService, ModalDialogService } from 'src/app/utils/index';
import { ContainerIconModule } from '../container-icon/container-icon.module';
import { DialogService } from './services/dialog.service';
import { DialogComponent } from './dialog.component';

@NgModule({
  declarations: [
    DialogComponent
  ],
  imports: [
    CommonModule,
    UtilsModule,
    ContainerIconModule,
    ButtonModule,
    CardModule
  ],
  exports: [
    DialogComponent
  ],
  entryComponents: [DialogComponent],
  providers: [
    DialogService,
    ModalDialogService,
    NavigatorService
  ]
})
export class NGZDialogModule {
  constructor() {}
  static forRoot(): ModuleWithProviders<NGZDialogModule> {
    return {
      ngModule: NGZDialogModule,
      providers: [
        DialogService,
        ModalDialogService,
        NavigatorService
      ]
    };
  }
}
