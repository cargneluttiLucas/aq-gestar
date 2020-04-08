import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/component';
import { ProjectsService } from './service/project.service';
import { ProjectComponent } from './component/project.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule
  ],
  declarations: [
    ProjectComponent
  ],
  exports: [
    ProjectComponent
  ],
  providers: [ProjectsService]
})
export class ProjectsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ProjectsModule
    };
  }
}