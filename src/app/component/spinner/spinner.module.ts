import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../utils/utils.module';
import { SpinnerComponent } from './spinner.component';
import { LoadingModule } from '../loading';

@NgModule({
  imports: [
    CommonModule,
    UtilsModule,
    LoadingModule
  ],
  declarations: [
    SpinnerComponent
  ],
  entryComponents: [
    SpinnerComponent
  ],
  exports: [
    SpinnerComponent
  ]
})
export class SpinnerModule {
  constructor() {}
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SpinnerModule
    };
  }
}
