import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequirementsComponent } from './requirements.component';
import { RequirementsRoutingModule } from './requirements.routing';
import { ComponentsModule, ModalModule } from 'src/app/component';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceModule } from 'src/app/services/service.module';
import { UserModule } from 'src/app/features/user';
import { MainObjectsModule } from 'src/app/features/main-object';
import { ProjectsModule } from 'src/app/features/projects';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { KeywordModule } from 'src/app/features/keyword/keyword.module';



@NgModule({
  imports: [
    CommonModule,
    ComponentsModule.forRoot(),
    ModalModule,
    ReactiveFormsModule,
    ServiceModule,
    RequirementsRoutingModule,
    UserModule.forRoot(),
    ProjectsModule.forRoot(),
    MainObjectsModule.forRoot(),
    KeywordModule.forRoot(),
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  providers: [
    MatNativeDateModule,
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  declarations: [
    RequirementsComponent
  ],
  exports: [
    RequirementsComponent
  ]
})
export class RequirementsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RequirementsModule
    };
  }
}
