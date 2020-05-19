import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProjectComponent } from './new-project.component';
import { NewProjectRoutingModule } from './new-project.routing';
import { ComponentsModule } from 'src/app/component';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceModule } from 'src/app/services/service.module';
import { RequirementsModule } from '../requirements';
import { ClientModule } from 'src/app/features/client';
import { UserModule } from 'src/app/features/user';
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
import { GestarNumericInputModule } from 'src/app/features/gestar-numeric-input/gestar-numeric-input.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    NewProjectRoutingModule,
    ReactiveFormsModule,
    ServiceModule,
    ClientModule.forRoot(),
    UserModule.forRoot(),
    RequirementsModule.forRoot(),
    KeywordModule.forRoot(),
    GestarNumericInputModule,
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
    NewProjectComponent
  ],
  exports: [
    NewProjectComponent
  ]
})
export class NewProjectModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NewProjectModule
    };
  }
}
