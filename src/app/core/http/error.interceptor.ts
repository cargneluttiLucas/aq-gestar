import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponseBase, HttpHeaderResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { httpErrorsCodes } from '../../constants/http-error-codes.constants';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => this.customErrorHandler(err)));
  }

  private customErrorHandler(response): Observable<HttpEvent<any>> {
    if (!environment.production) {
      // Do something with the error
      console.error('Request error', response);
    }
    throw response;
  }
}
