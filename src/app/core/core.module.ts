import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
// interceptors
import { ErrorInterceptor } from './http/error.interceptor';
import { HttpService } from './http/http.service';
import { TimingInterceptor } from './http/timing.interceptor';
import { LoggerService } from './utils/services/logger.service';
import { CoreUtilModule } from './utils/utils.module';
import { I18nBrowserModule } from './i18n/i18n-browser.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    CoreUtilModule,
    I18nBrowserModule,
  ],
  providers: [
    {
      provide: HttpClient,
      useClass: HttpService,
    },
    ErrorInterceptor,
    TimingInterceptor,
    LoggerService,
  ],
  exports: [
    I18nBrowserModule,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }
}
