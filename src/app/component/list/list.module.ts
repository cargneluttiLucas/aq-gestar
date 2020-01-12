import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NGZListComponent } from './list.component';
import { UtilsModule } from '../../utils/utils.module';

@NgModule({
  imports: [
    CommonModule,
    UtilsModule
  ],
  declarations: [
    NGZListComponent
  ],
  exports: [
    NGZListComponent
  ]
})
export class ListModule {
  constructor() {}
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ListModule
    };
  }
}
