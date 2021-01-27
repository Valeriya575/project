import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDetails, BasicUser } from '../../models/user';

import { Observable } from 'rxjs';

/*
  Generated class for the ProfileProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProfileProvider {
  private URL = 'http://localhost:3000/api/v1/users/me';
  private DELETE_STATION_URL = 'http://localhost:3000/api/v1/users/me/favourite/stations/';
  private DELETE_BUS_URL = 'http://localhost:3000/api/v1/users/me/favourite/buses/';

  constructor(public http: HttpClient) {
    console.log('Hello ProfileProvider Provider');
  }
  
  public getMe() {
    return this.http.get<UserDetails>(this.URL);
  }

  public updateUserInfo(user: BasicUser) {
    return this.http.patch<BasicUser>(this.URL, user);
  }

  public deleteStation(stationId: number) {
    this.DELETE_STATION_URL += stationId;
    console.log(this.DELETE_STATION_URL);
    return this.http.delete(this.DELETE_STATION_URL);
  }

  public deleteBus(busId: string) {
    this.DELETE_BUS_URL += busId;
    return this.http.delete(this.DELETE_BUS_URL);
  }
}
