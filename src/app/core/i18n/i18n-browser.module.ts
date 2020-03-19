import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs';
import { I18nService } from './i18n.service';

export class TranslatesBrowserLoaderService implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private prefix: string = './assets/i18n/',
    private suffix: string = '.json',
  ) {}

  public getTranslation(lang: string): Observable<any> {
    return new TranslateHttpLoader(this.http, this.prefix, this.suffix).getTranslation(lang);
  }
}

export function translateStaticLoader(
  http: HttpClient,
): TranslatesBrowserLoaderService {
  return new TranslatesBrowserLoaderService(http);
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateStaticLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [I18nService],
})
export class I18nBrowserModule {
  constructor(private _i18nService: I18nService) {
    this._i18nService.init();
  }
}
