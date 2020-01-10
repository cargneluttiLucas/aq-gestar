import { NgModule, ModuleWithProviders } from '@angular/core';
import { ModalDialogService } from './modal-dialog.service';
import { ModalDialogInstanceService } from './modal-dialog-instance.service';

@NgModule({
  providers: [ModalDialogService, ModalDialogInstanceService]
})
export class ModalsModule {
  constructor() {}
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ModalsModule
    };
  }
}
