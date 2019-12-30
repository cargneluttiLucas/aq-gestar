import { NgModule, ModuleWithProviders } from '@angular/core';
import { RequierementsService } from './requirements.service';
import { NewProjectService } from './new-project.service';

@NgModule({
    providers: [NewProjectService, RequierementsService]
})
export class ServiceModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServiceModule
    };
  }
}