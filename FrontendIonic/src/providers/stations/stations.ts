import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Station } from '../../models/station';

import { catchError, tap } from 'rxjs/operators';
/*
  Generated class for the StationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StationsProvider {
  private stationsURL = 'http://localhost:3000/api/v1/lj/stations';

  constructor(public http: HttpClient) {
    console.log('Hello StationsProvider Provider');
  }

  getStations(): Observable<Station[]> {
    return this.http.get<Station[]>(this.stationsURL)
      .pipe(
        tap(_ => console.log(_)),
        catchError(this.handleError('GETstations', []))
      );
  }

  getStationDetails(stationId: string): Observable<Station> {
    const constructedUrl = `${this.stationsURL}/${stationId}`;
    return this.http.get<Station>(constructedUrl)
    .pipe(
      tap(_ => console.log(_)),
      catchError(this.handleError('GETstations', new Station))
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
