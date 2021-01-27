import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';

import { StationsProvider } from '../../providers/stations/stations';
import { BusProvider } from '../../providers/bus/bus';

import { UserDetails, BasicUser } from '../../models/user';
import { Station, BasicStation } from '../../models/station';
import { Bus, BasicBus } from '../../models/bus';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage{
  user = new UserDetails();
  stationList: Station[] = [];
  busList: Bus[] = [];
  selectedStation: Station;
  selectedBus: Bus;


  constructor(public navCtrl: NavController,
    private profileProvider: ProfileProvider,
    private stationProvider: StationsProvider,
    private busProvider: BusProvider
  ) {}

  ionViewCanEnter(){
    console.log("in ionViewCanEnter")
  
    this.update();
  }

  async getUser() {
    this.user = await this.profileProvider.getMe().toPromise();
  }

  async getStations() {
    await this.stationProvider.getStations().subscribe(stations => this.stationList = stations);
  }

  async getBuses() {
    await this.busProvider.getBuses().subscribe(buses => this.busList = buses);
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
    await this.profileProvider.updateUserInfo(basicUser).toPromise();
    this.user = await this.profileProvider.getMe().toPromise();
  }

  async deleteStation(stationId: number) {
    await this.profileProvider.deleteStation(stationId).toPromise();
    this.user = await this.profileProvider.getMe().toPromise();
  }

  async deleteBus(busId: string) {
    await this.profileProvider.deleteBus(busId).toPromise();
    this.user = await this.profileProvider.getMe().toPromise();
  }

}
