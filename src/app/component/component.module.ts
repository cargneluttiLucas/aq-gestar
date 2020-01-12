import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextfieldModule } from './textfield/textfield.module';
import { TextfieldPredictiveModule } from './textfield-predictive/textfield-predictive.module';
import { UtilsModule } from '../utils/utils.module';
import { ButtonModule } from './button/button.module';
import { LoadingModule } from './loading/loading.module';
import { SelectModule } from './select';
import { ListModule } from './list';
import { ModalsModule } from '../utils/services/modal/modal.module';

@NgModule({
  imports: [
    CommonModule,
    TextfieldModule.forRoot(),
    ButtonModule.forRoot(),
    LoadingModule.forRoot(),
    UtilsModule.forRoot(),
    SelectModule.forRoot(),
    ListModule.forRoot(),
    ModalsModule.forRoot(),
    TextfieldPredictiveModule.forRoot()
  ],
  declarations: [
  ],
  exports: [
    TextfieldModule,
    ButtonModule,
    LoadingModule,
    SelectModule,
    UtilsModule,
    ListModule,
    ModalsModule,
    TextfieldPredictiveModule
  ]
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ComponentsModule
    };
  }
}
