import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserDetails, BasicUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private URL = 'http://localhost:3000/api/v1/users/me';
  private DELETE_STATION_URL = 'http://localhost:3000/api/v1/users/me/favourite/stations/';
  private DELETE_BUS_URL = 'http://localhost:3000/api/v1/users/me/favourite/buses/';

  constructor(
    private http: HttpClient
  ) { }

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
