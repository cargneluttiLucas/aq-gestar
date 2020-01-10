import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../utils/utils.module';
import { SelectComponent } from './select.component';
import { SelectResultsComponent } from './select-results/select-results.component';
import { FormModule } from '../form';

@NgModule({
  declarations: [
    SelectComponent,
    SelectResultsComponent
  ],
  imports: [
    CommonModule,
    FormModule,
    UtilsModule.forRoot()
  ],
  exports: [
    SelectComponent,
    SelectResultsComponent
  ], entryComponents: [SelectResultsComponent]
})
export class SelectModule {
  constructor() {}
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SelectModule
    };
  }
}
