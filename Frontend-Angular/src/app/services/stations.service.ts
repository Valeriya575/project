import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { Station } from '../models/station';

import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StationsService {

  private stationsURL = 'http://localhost:3000/api/v1/lj/stations';

  constructor(
    private http: HttpClient
  ) { }

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
