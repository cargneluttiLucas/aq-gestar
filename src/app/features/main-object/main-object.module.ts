import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainObjectsComponent } from './component/main-object.component';
import { ComponentsModule } from 'src/app/component';
import { MainObjectsService } from './service/main-object.service';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule
  ],
  declarations: [
    MainObjectsComponent
  ],
  exports: [
    MainObjectsComponent
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
