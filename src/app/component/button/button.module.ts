import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { LoadingModule } from '../loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    LoadingModule
  ],
  declarations: [
    ButtonComponent
  ],
  exports: [
    ButtonComponent
  ]
})
export class ButtonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ButtonModule
    };
  }
}
