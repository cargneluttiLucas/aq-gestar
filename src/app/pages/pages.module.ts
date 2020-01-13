import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProjectModule } from './new-project/new-project.module';
import { RequirementsModule } from './requirements/requirements.module';
import { HomeModule } from './home';
import { SprintModule } from './sprint';

@NgModule({
  imports: [
    CommonModule,
    NewProjectModule.forRoot(),
    RequirementsModule.forRoot(),
    HomeModule.forRoot(),
    SprintModule.forRoot()
  ],
  declarations: [
  ],
  exports: [
    NewProjectModule,
    RequirementsModule,
    HomeModule,
    SprintModule
  ]
})
export class PagesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PagesModule
    };
  }
}
