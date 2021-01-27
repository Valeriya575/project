import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Bus } from '../models/bus';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  private busURL = 'http://localhost:3000/api/v1/lj/buses';

  constructor(
    private http: HttpClient
  ) { }

  getBuses(): Observable<Bus[]> {
    return this.http.get<Bus[]>(this.busURL)
      .pipe(
        tap(_ => console.log(_)),
        catchError(this.handleError('GET-BUSES', []))
      );
  }

  getBusDetails(busId: string): Observable<Bus> {
    const constructedUrl = `${this.busURL}/${busId}`;
    return this.http.get<Bus>(constructedUrl)
    .pipe(
      tap(_ => console.log(_)),
      catchError(this.handleError('GET-BUS-DETAIL', new Bus()))
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
