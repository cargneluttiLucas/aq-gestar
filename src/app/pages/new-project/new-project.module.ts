import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProjectComponent } from './new-project.component';
import { NewProjectRoutingModule } from './new-project.routing';
import { ComponentsModule } from 'src/app/component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    NewProjectRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    NewProjectComponent
  ],
  exports: [
    NewProjectComponent
  ]
})
export class NewProjectModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NewProjectModule
    };
  }
}
