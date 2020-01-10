import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextfieldModule } from './textfield/textfield.module';
import { FormModule } from './form/forms.module';
import { UtilsModule } from '../utils/utils.module';
import { ButtonModule } from './button/button.module';
import { LoadingModule } from './loading/loading.module';
import { SelectModule, SelectComponent, SelectResultsComponent } from './select';
import { ModalDialogService } from '../utils/services';

@NgModule({
  imports: [
    CommonModule,
    TextfieldModule.forRoot(),
    ButtonModule.forRoot(),
    LoadingModule.forRoot(),
    UtilsModule.forRoot(),
    SelectModule.forRoot()
  ],
  declarations: [
  ],
  exports: [
    TextfieldModule,
    ButtonModule,
    LoadingModule,
    SelectModule,
    UtilsModule
  ]
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ComponentsModule
    };
  }
}
