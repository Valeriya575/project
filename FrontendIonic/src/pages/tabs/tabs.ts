import { Component, ViewChild  } from '@angular/core';

import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

@ViewChild(Nav) nav: Nav;
  tab1Root = 'PlannerPage';
  tab2Root = 'MapPage';
  myIndex: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.myIndex = navParams.data.tabIndex || 0;
  }

  ionViewDidLoad() {
      this.myIndex = this.navParams.data.tabIndex || 0;
}
}
