import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { UtilsModule } from 'src/app/utils';

@NgModule({
  declarations: [
    CardComponent
  ],
  imports: [
    CommonModule,
    UtilsModule
  ],
  exports: [
    CardComponent
  ]
})
export class CardModule {
  static forRoot(): ModuleWithProviders<CardModule> {
    return {
      ngModule: CardModule
    };
  }
}
