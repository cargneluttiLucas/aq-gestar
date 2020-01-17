import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';
import { UtilsModule } from '../../utils/utils.module';
import { TabComponent } from './tab/tab.component';

@NgModule({
  declarations: [
    TabsComponent,
    TabComponent
  ],
  imports: [
    CommonModule,
    UtilsModule
  ],
  exports: [
    TabsComponent,
    TabComponent
  ]
})
export class TabsModule {
  constructor() {}
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TabsModule
    };
  }
}
