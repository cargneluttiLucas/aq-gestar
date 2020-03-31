import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from '../card/card.module';
import { ButtonModule } from '../button/button.module';
import { UtilsModule, NavigatorService } from 'src/app/utils/index';

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
