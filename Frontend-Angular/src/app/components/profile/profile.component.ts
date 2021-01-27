import { Component, OnInit } from '@angular/core';

import { ProfileService } from 'src/app/services/profile.service';
import { StationsService } from 'src/app/services/stations.service';
import { BusService } from 'src/app/services/bus.service';

import { UserDetails, BasicUser } from 'src/app/models/user';
import { Station, BasicStation } from 'src/app/models/station';
import { Bus, BasicBus } from 'src/app/models/bus';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = new UserDetails();
  stationList: Station[] = [];
  busList: Bus[] = [];
  selectedStation: Station;
  selectedBus: Bus;

  constructor(
    private profileService: ProfileService,
    private stationService: StationsService,
    private busService: BusService
  ) { }

  async ngOnInit() {
    this.update();
  }

  async getUser() {
    this.user = await this.profileService.getMe().toPromise();
  }

  async getStations() {
    await this.stationService.getStations().subscribe(stations => this.stationList = stations);
  }

  async getBuses() {
    await this.busService.getBuses().subscribe(buses => this.busList = buses);
  }

  update() {
    this.getUser();
    this.getStations();
    this.getBuses();
  }

  async saveChanges() {
    if (this.selectedStation) {
      const basicStation = new BasicStation();
      basicStation.id = this.selectedStation.id;
      basicStation.name = this.selectedStation.stationName;
      this.user.favouriteStations.push(basicStation);
    }

    if (this.selectedBus) {
      const basicBus = new BasicBus();
      basicBus.id = this.selectedBus.id;
      basicBus.name = this.selectedBus.busDirection;
      this.user.favouriteBuses.push(basicBus);
    }

    const basicUser = new BasicUser();
    basicUser.email = this.user.email;
    basicUser.password = this.user.password;
    basicUser.favouriteStations = this.user.favouriteStations;
    basicUser.favouriteBuses = this.user.favouriteBuses;

    this.updateUserInfo(basicUser);
  }

  async updateUserInfo(basicUser: BasicUser) {
    await this.profileService.updateUserInfo(basicUser).toPromise();
    this.user = await this.profileService.getMe().toPromise();
  }

  async deleteStation(stationId: number) {
    await this.profileService.deleteStation(stationId).toPromise();
    this.user = await this.profileService.getMe().toPromise();
  }

  async deleteBus(busId: string) {
    await this.profileService.deleteBus(busId).toPromise();
    this.user = await this.profileService.getMe().toPromise();
  }
}
