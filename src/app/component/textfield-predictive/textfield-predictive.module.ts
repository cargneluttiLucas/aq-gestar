import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextfieldPredictiveComponent } from './textfield-predictive.component';
import { UtilsModule } from '../../utils/utils.module';
import { TextfieldModule } from '../textfield/textfield.module';
import { SelectModule } from '../select/select.module';
import { ModalModule } from '../modal/modal.module';
import { ListModule } from '../list/index';

@NgModule({
  imports: [
    CommonModule,
    UtilsModule,
    TextfieldModule,
    ModalModule,
    SelectModule,
    ListModule
  ],
  declarations: [
    TextfieldPredictiveComponent
  ],
  exports: [
    TextfieldPredictiveComponent
  ],
  providers: []
})
export class TextfieldPredictiveModule {
  constructor() { }
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TextfieldPredictiveModule
    };
  }
}
