import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextfieldComponent } from './textfield.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TextfieldComponent
  ],
  exports: [
    TextfieldComponent
  ]
})
export class TextfieldModule {
}