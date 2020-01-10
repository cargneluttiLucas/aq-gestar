import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProjectModule } from './new-project/new-project.module';
import { RequirementsModule } from './requirements/requirements.module';

@NgModule({
  imports: [
    CommonModule,
    NewProjectModule.forRoot(),
    RequirementsModule.forRoot()
  ],
  declarations: [
  ],
  exports: [
    NewProjectModule,
    RequirementsModule
  ]
})
export class PagesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PagesModule
    };
  }
}
