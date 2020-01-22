import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './component/user.component';
import { TextfieldPredictiveModule } from 'src/app/component';

@NgModule({
  imports: [
    CommonModule,
    TextfieldPredictiveModule.forRoot()
  ],
  declarations: [
    UserComponent
  ],
  exports: [
    UserComponent
  ],
  providers: []
})
export class UserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UserModule
    };
  }
}
