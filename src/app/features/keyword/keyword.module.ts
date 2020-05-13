import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeywordComponent } from './component/keyword.component';
import { ComponentsModule } from 'src/app/component';
import { MatInputModule, MatAutocompleteModule, MatProgressSpinnerModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  declarations: [
    KeywordComponent
  ],
  exports: [
    KeywordComponent,
  ],
  providers: [],
})
export class KeywordModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: KeywordModule
    };
  }
}
