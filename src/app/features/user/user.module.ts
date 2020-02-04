import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextfieldPredictiveModule, ComponentsModule } from 'src/app/component';
import { UserService } from './service/user.service';
import { UserComponent } from './component/user.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule
  ],
  declarations: [
    UserComponent
  ],
  exports: [
    UserComponent
  ],
  providers: [UserService]
})
export class UserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UserModule
    };
  }
}
