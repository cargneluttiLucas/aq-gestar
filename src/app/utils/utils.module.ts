import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaskModule } from './mask';
import { ServicesModule } from './services';
import { DirectiveModule } from './directives';

@NgModule({
  imports: [
    CommonModule,
    MaskModule.forRoot(),
    ServicesModule.forRoot(),
    DirectiveModule.forRoot(),
    ReactiveFormsModule
  ],
  exports: [
    ReactiveFormsModule,
    MaskModule,
    ServicesModule,
    DirectiveModule
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
