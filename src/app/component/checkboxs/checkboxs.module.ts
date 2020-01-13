import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../utils/utils.module';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ContainerCheckboxsComponent } from './checkboxs.component';

@NgModule({
  declarations: [
    ContainerCheckboxsComponent,
    CheckboxComponent
  ],
  imports: [
    CommonModule,
    UtilsModule
  ],
  exports: [
    ContainerCheckboxsComponent,
    CheckboxComponent
  ]
})
export class CheckboxsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CheckboxsModule
    };
  }
}
