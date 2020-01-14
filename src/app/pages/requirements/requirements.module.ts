import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequirementsComponent } from './requirements.component';
import { RequirementsRoutingModule } from './requirements.routing';
import { ComponentsModule } from 'src/app/component';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceModule } from 'src/app/services/service.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    ServiceModule,
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