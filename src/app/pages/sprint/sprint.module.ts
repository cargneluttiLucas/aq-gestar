import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprintComponent } from './sprint.component';
import { SprintRoutingModule } from './sprint.routing';
import { ComponentsModule } from 'src/app/component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    SprintRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    SprintComponent
  ],
  exports: [
    SprintComponent
  ]
})
export class SprintModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SprintModule
    };
  }
}
