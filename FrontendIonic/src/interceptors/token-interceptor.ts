import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse} from '@angular/common/http';

import { AuthProvider } from '../providers/auth/auth';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertController } from 'ionic-angular';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private authProvider: AuthProvider,
    private alertCtrl: AlertController
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authProvider.token}`
      }
    });
 // return next.handle(request);

  return next.handle(request).pipe(catchError((error, caught) => {
    this.handleAuthError(error);
    return of(error);
  }) as any);
}

private handleAuthError(err: HttpErrorResponse): Observable<any> {
  if (err.status === 403) {
    this.presentAlert('Wrong combination. Try again');
    return of(err.message);
  }
  // throw error;
}

  presentAlert(title) {
    let alert = this.alertCtrl.create({
      title: title,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
