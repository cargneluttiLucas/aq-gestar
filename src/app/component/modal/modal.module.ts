import { NgModule, ModuleWithProviders } from '@angular/core';
import { ModalComponent } from './modal.component';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../utils/utils.module';
import { ModalService } from './service/modal.service';

@NgModule({
  declarations: [
    ModalComponent
  ],
  imports: [
    CommonModule,
    UtilsModule
  ],
  exports: [
    ModalComponent
  ],
  providers: [ModalService]
})
export class ModalModule {
  constructor() {}
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ModalModule,
      providers: [
        ModalService
      ]
    };
  }
}
