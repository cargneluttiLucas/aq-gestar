import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from 'src/app/utils';
import { ContainerIconComponent } from './container-icon.component';

@NgModule({
  declarations: [
    ContainerIconComponent
  ],
  imports: [
    CommonModule,
    UtilsModule
  ],
  exports: [
    ContainerIconComponent,
  ]
})
export class ContainerIconModule {
  static forRoot(): ModuleWithProviders<ContainerIconModule> {
    return {
      ngModule: ContainerIconModule
    };
  }
}
