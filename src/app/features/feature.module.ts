import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientModule } from './client/client.module';
import { UserModule } from './user';


@NgModule({
  imports: [
    CommonModule,
    ClientModule.forRoot(),
    UserModule.forRoot()
  ],
  declarations: [],
  exports: [
    ClientModule,
    UserModule
  ]
})
export class FeaturesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FeaturesModule
    };
  }
}
