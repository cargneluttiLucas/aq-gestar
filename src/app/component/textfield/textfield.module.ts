import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextfieldComponent } from './textfield.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '../form';
import { MaskModule } from 'src/app/utils';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormModule.forRoot(),
    MaskModule.forRoot()
  ],
  declarations: [
    TextfieldComponent
  ],
  exports: [
    TextfieldComponent
  ]
})
export class TextfieldModule {
  constructor() {}
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TextfieldModule
    };
  }
}