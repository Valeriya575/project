import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

import { Arrival } from '../../models/line';
import { tap, catchError } from 'rxjs/operators';
/*
  Generated class for the LinesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LinesProvider {
  private linesURL = 'http://localhost:3000/api/v1/lj/schedule';

  constructor(public http: HttpClient) {
    console.log('Hello LinesProvider Provider');
  }


  getLines(stationId: number, busId: string): Observable<Arrival[]> {
    const constructedURL = this.linesURL + '?s=' + stationId + '&b=' + busId;
    return this.http.get<Arrival[]>(constructedURL)
      .pipe(
        tap(_ => console.log(_)),
        catchError(this.handleError('GETlines', []))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
