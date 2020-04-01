import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDialogComponent } from './custom-dialog.component';
import { CardModule } from '../card/card.module';
import { UtilsModule, ModalDialogService, NavigatorService } from 'src/app/utils/index';
import { CustomDialogService } from './services/custom-dialog.service';

@NgModule({
  declarations: [
    CustomDialogComponent
  ],
  imports: [
    CommonModule,
    UtilsModule,
    CardModule
  ],
  exports: [
    CustomDialogComponent
  ],
  entryComponents: [CustomDialogComponent],
  providers: [
    CustomDialogService,
    ModalDialogService,
    NavigatorService
  ]
})
export class CustomDialogModule {
  constructor() {}
  static forRoot(): ModuleWithProviders<CustomDialogModule> {
    return {
      ngModule: CustomDialogModule,
      providers: [
        CustomDialogService,
        ModalDialogService,
        NavigatorService
      ]
    };
  }
}
