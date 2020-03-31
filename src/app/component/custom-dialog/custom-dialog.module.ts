import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDialogService } from '../../utils/services/modal/modal-dialog.service';
import { CustomDialogComponent } from './custom-dialog.component';
import { NGZCustomDialogService } from './services/custom-dialog.service';
import { CardModule } from '../card/card.module';
import { NavigatorService } from '../../utils/services/navigator/navigator.service';
import { UtilsModule } from 'src/app/utils/index';

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
        NGZCustomDialogService,
        NGZModalDialogService,
        NavigatorService
      ]
    };
  }
}
