import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Station } from '../../models/station';
import { StationsProvider } from '../../providers/stations/stations';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the StationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stations',
  templateUrl: 'stations.html',
})
export class StationsPage {
  stations: Station[];
  allStations: Station[];
  listInitialized = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private stationService: StationsProvider,
    private alertCtrl: AlertController) {
    this.getStations();

  }


  filterStations(term: string) {
    if (this.listInitialized === false) {
      this.allStations = this.stations;
    }
    this.listInitialized = true;

    this.stations = [];
    this.allStations.forEach(station => {
      if (station.stationName.includes(term)) {
        this.stations.push(station);
      }
    });
  }

  async getStations() {
    await this.stationService.getStations().subscribe(stations => this.stations = stations);
  }

  details(station){
    console.log("Details");
    this.presentAlert("<h1>"+station.stationName+"</h1><br><p>ID: "+station.id+"</p><p>Coordinates: "+station.location.lon+","+station.location.lat+"</p></br>");
  }

  presentAlert(message) {
    let alert = this.alertCtrl.create({
      title: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
