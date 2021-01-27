import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Bus } from '../../models/bus';
import { BusProvider } from '../../providers/bus/bus';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the BusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bus',
  templateUrl: 'bus.html',
})
export class BusPage {
  buses: Bus[];
  allBuses: Bus[];
  listInitialized = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private busProvider: BusProvider, private alertCtrl: AlertController) {
    this.getBuses();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusPage');
  }

  filterBuses(term: string) {
    if (this.listInitialized === false) {
      this.allBuses = this.buses;
    }
    this.listInitialized = true;

    this.buses = [];
    this.allBuses.forEach(bus => {
      if (bus.busDirection.includes(term)) {
        this.buses.push(bus);
      }
    });
  }

  async getBuses() {
    await this.busProvider.getBuses().subscribe(buses => this.buses = buses);
  }

  details(bus){
    this.presentAlert("<h1>Bus direction: "+bus.busDirection+"</h1>");
  }

  presentAlert(message) {
    let alert = this.alertCtrl.create({
      title: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
