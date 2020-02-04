import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from './component/client.component';
import { ComponentsModule } from 'src/app/component';
import { ClientService } from './service/client.service';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule
  ],
  declarations: [
    ClientComponent
  ],
  exports: [
    ClientComponent
  ],
  providers: [ClientService]
})
export class ClientModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ClientModule
    };
  }
}
