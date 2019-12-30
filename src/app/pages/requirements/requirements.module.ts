import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequirementsComponent } from './requirements.component';
import { RequirementsRoutingModule } from './requirements.routing';

@NgModule({
  imports: [
    CommonModule,
    RequirementsRoutingModule
  ],
  declarations: [
    RequirementsComponent
  ],
  exports: [
    RequirementsComponent
  ]
})
export class RequirementsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RequirementsModule
    };
  }
}