import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../utils/utils.module';
import { ShowTextComponent } from './show-text.component';

@NgModule({
  imports: [
    CommonModule,
    UtilsModule,
  ],
  declarations: [
    ShowTextComponent
  ],
  exports: [
    ShowTextComponent
  ]
})
export class ShowTextModule {
  constructor() {}
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ShowTextModule
    };
  }
}
