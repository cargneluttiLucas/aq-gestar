import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainObjectsComponent } from './component/main-object.component';
import { ComponentsModule } from 'src/app/component';
import { MainObjectsService } from './service/main-object.service';
import { MatInputModule, MatAutocompleteModule, MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    MainObjectsComponent
  ],
  exports: [
    MainObjectsComponent,
  ],
  providers: [MainObjectsService]
})
export class MainObjectsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MainObjectsModule
    };
  }
}
