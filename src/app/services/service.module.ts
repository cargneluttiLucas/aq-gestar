import { NgModule, ModuleWithProviders } from '@angular/core';
import { RequierementsService } from './requirements.service';
import { NewProjectService } from './new-project.service';
import { CookieService } from './cookie.service';

@NgModule({
    providers: [NewProjectService, RequierementsService, CookieService]
})
export class ServiceModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServiceModule
    };
  }
}