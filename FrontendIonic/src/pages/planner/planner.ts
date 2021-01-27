import { Component,NgZone } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';
import { Arrival } from '../../models/line';
import { Station } from '../../models/station';
import { Bus } from '../../models/bus';
import { UserDetails } from '../../models/user';
import { StationsProvider } from '../../providers/stations/stations';
import { BusProvider } from '../../providers/bus/bus';
import { LinesProvider } from '../../providers/lines/lines';
import { AlertController } from 'ionic-angular';
import { DatePipe } from '@angular/common'

@IonicPage()
@Component({
  selector: 'page-planner',
  templateUrl: 'planner.html'
})
export class PlannerPage {
  lines: Arrival[];
  stationList: Station[] = [];
  busList: Bus[] = [];
  selectedStation: Station;
  selectedBus: Bus;
  user = new UserDetails();
  dayTypeList = [ 'All', 'Delavnik', 'Sobota', 'Nedelja in prazniki' ];
  selectedDayType = '';
  selectedDate: any;

  constructor(public navCtrl: NavController,
     private linesProvider: LinesProvider, private alertCtrl: AlertController, public datepipe: DatePipe, private zone: NgZone,
     private profileProvider: ProfileProvider,
     private authProvider: AuthProvider,
     private stationProvider: StationsProvider,
     private busProvider: BusProvider,
     ) {
  }
  async ngOnInit() {
    this.update();
  }

  showArrivalTimes(line){
    var message = "";
    for (let index = 0; index < line.arrivalTimes.length; index++) {
      message += this.datepipe.transform((line.arrivalTimes[index]), "mediumTime") + "<br>";
      
    }
    this.presentAlert("Arrival times",message)
  }

  async presentAlert(title,message) {
    const alert = await this.alertCtrl.create({
      mode: 'md',
      title: title,
      message: '<div style="overflow-y:auto;max-height:240px;">'+message+'</div>',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    });
    await alert.present();
  }

  update() {
    this.getStations();
    this.getBuses();
    if (this.authProvider.token) {
      this.getUser();
    }
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

  async getLines() {
    await this.linesProvider.getLines(this.selectedStation.id, this.selectedBus.id).subscribe(lines => this.lines = lines);
  }

  filterResults() {
    if (this.selectedDate) {

      let arr_of_indexes = [];
      for (let i = 0; i < this.lines.length; i++) {
        let contains = false;
        for(let j = 0; j < this.lines[i].arrivalTimes.length; j++){
          if(this.datepipe.transform(this.lines[i].arrivalTimes[j], "hh:mm") === this.selectedDate){
            console.log(this.datepipe.transform(this.lines[i].arrivalTimes[j], "hh:mm") + " === "+ this.selectedDate)
            contains = true;
            break;
          }
        }
        if(!contains){
          arr_of_indexes.push(i);
        }
      }

      this.zone.run(() => {
        for(let index = arr_of_indexes.length-1; index >= 0; index--){
          this.lines.splice(index, 1);
        }
      });
    }

    if (this.selectedDayType !== '' && this.selectedDayType !== 'All') {
      const filtered = this.lines.filter((_) => {
        return _.dayType === this.selectedDayType;
      });
      this.zone.run(() => {
        this.lines = filtered;
      });
    }
  }

  selectStation(stationId: number) {
    this.selectedStation = this.stationList.find(_ => _.id === stationId);
  }

  selectBus(busId: string) {
    this.selectedBus = this.busList.find(_ => _.id === busId);
  }

  async gotoStationDetails(stationId: number) {
    await this.stationProvider.getStationDetails(String(stationId)).subscribe(station => this.presentAlert("Station details",station.stationName));
  }

  async gotoBusDetails(busId: string) {
    let bus = new Bus();
    await this.busProvider.getBusDetails(busId).subscribe(bus => this.presentAlert("Bus details",bus.busLine));
  }
}
