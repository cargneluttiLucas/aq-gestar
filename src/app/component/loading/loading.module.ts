import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading.component';
import { UtilsModule } from '../../utils/utils.module';

@NgModule({
  declarations: [
    LoadingComponent
  ],
  imports: [
    CommonModule,
    UtilsModule
  ],
  exports: [
    LoadingComponent,
    UtilsModule
  ]
})
export class LoadingModule {
  constructor() {}
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LoadingModule
    };
  }
}
