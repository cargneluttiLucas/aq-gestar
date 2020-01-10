import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaskModule } from './mask';
import { ServicesModule } from './services';

@NgModule({
  imports: [
    CommonModule,
    MaskModule.forRoot(),
    ServicesModule.forRoot(),
    ReactiveFormsModule
  ],
  exports: [
    ReactiveFormsModule,
    MaskModule,
    ServicesModule
  ]
})
export class UtilsModule {
  constructor() {}
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UtilsModule
    };
  }
}
