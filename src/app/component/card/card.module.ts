import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NGZCardComponent } from './card.component';
import { UtilsModule } from 'src/app/utils';

@NgModule({
  declarations: [
    NGZCardComponent
  ],
  imports: [
    CommonModule,
    UtilsModule
  ],
  exports: [
    NGZCardComponent
  ]
})
export class CardModule {
  static forRoot(): ModuleWithProviders<CardModule> {
    return {
      ngModule: CardModule
    };
  }
}
