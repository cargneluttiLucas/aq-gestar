import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextfieldModule } from './textfield/textfield.module';

@NgModule({
  imports: [
    CommonModule,
    TextfieldModule
  ],
  declarations: [
  ],
  exports: [
    TextfieldModule
  ]
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ComponentsModule
    };
  }
}