import { NgModule, ModuleWithProviders } from '@angular/core';
import { DocumentService } from './document/document.service';
import { WindowService } from './window/window.service';
import { NavigatorService } from './navigator/navigator.service';
import { KeypressService } from './keypress/keypress.service';
import { ModalsModule } from './modal/modal.module';
import { BeforeunloadService } from './beforeunload/beforeunload.service';

@NgModule({
  imports: [ModalsModule.forRoot()],
  exports: [ModalsModule],
  providers: [DocumentService, WindowService, NavigatorService, KeypressService, BeforeunloadService]
})
export class ServicesModule {
  constructor() {}
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule
    };
  }
}
