import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequirementsComponent } from './requirements.component';
import { RequirementsRoutingModule } from './requirements.routing';
import { ComponentsModule, ModalModule } from 'src/app/component';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceModule } from 'src/app/services/service.module';
import { UserModule } from 'src/app/features/user';
import { MainObjectsModule } from 'src/app/features/main-object';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule.forRoot(),
    ModalModule,
    ReactiveFormsModule,
    ServiceModule,
    RequirementsRoutingModule,
    UserModule.forRoot(),
    MainObjectsModule.forRoot()
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
