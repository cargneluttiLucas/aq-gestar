import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestarNumericInputComponent } from './component/gestar-numeric-input.component';
import { MatInputModule, MatAutocompleteModule, MatProgressSpinnerModule } from '@angular/material';



@NgModule({
  declarations: [GestarNumericInputComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    GestarNumericInputComponent
  ],
})
export class GestarNumericInputModule { }
