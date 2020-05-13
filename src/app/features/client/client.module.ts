import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from './component/client.component';
import { ComponentsModule } from 'src/app/component';
import { ClientService } from './service/client.service';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
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
