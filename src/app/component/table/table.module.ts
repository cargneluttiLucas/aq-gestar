import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../utils/utils.module';
import { TableComponent } from './table.component';

@NgModule({
  declarations: [
    TableComponent
  ],
  imports: [
    CommonModule,
    UtilsModule
  ],
  exports: [
    TableComponent
  ]
})
export class TableModule {
  constructor() {}
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TableModule
    };
  }
}
