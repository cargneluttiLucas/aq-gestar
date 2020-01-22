import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from './component/client.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ClientComponent
  ],
  exports: [
    ClientComponent
  ],
  providers: []
})
export class ClientModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ClientModule
    };
  }
}
