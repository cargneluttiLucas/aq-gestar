import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../utils/utils.module';
import { HeaderComponent } from './header.component';

@NgModule({
  imports: [
    CommonModule,
    UtilsModule,
  ],
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule {
  constructor() {}
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HeaderModule
    };
  }
}
