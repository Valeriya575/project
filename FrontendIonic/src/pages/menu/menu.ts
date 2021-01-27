import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  rootPage  = "HomePage";

  @ViewChild(Nav) nav: Nav;
  _tab = "";
  pages: PageInterface[] = [
    {title: "Home", pageName: "HomePage", icon: "home"},
    {title: "Planner", pageName: "TabsPage", tabComponent: "PlannerPage", index: 0, icon: "bus"},
    {title: "Map", pageName: "TabsPage", tabComponent: "MapPage", index: 1, icon: "locate"},
    {title: "Stations", pageName: "StationsPage", icon: "document"},
    {title: "Buses", pageName: "BusPage", icon: "bus"},
    {title: "Settings", pageName: "SettingsPage", icon: "hammer"},
    {title: "Login", pageName: "Tabs2Page", tabComponent: "LoginPage", index: 0, icon: "person"},
    {title: "Create an account", pageName: "Tabs2Page", tabComponent: "RegisterPage", index: 1, icon: "contact"},
  ]


  constructor(public navCtrl: NavController, public navParams: NavParams, private authProvider: AuthProvider) {
  }

  isenabled(){
    if(this.authProvider.token == null){
        return false;
    }
    else{
        return true;
    } 
  }

  openPage(page: PageInterface){

    let params = {};

    if(page.index){
      params = {tabIndex: page.index}
    }
    else{
      params = {tabIndex: 0} 
    }

    if(this.nav.getActiveChildNav() && page.index != undefined){
      if(this._tab == "TabsPage" && page.pageName == "TabsPage"){
        this._tab=page.pageName;
        this.nav.getActiveChildNav().select(page.index);
      }
      else if(this._tab == "Tabs2Page" && page.pageName == "Tabs2Page"){
        this._tab=page.pageName;
        this.nav.getActiveChildNav().select(page.index);
      }
      else{
        this._tab=page.pageName;
        this.nav.setRoot(page.pageName, params);
      }
    }
    else{
        this._tab=page.pageName;
        this.nav.setRoot(page.pageName, params);
    }
  }

  isActive(page: PageInterface){
    let childNav = this.nav.getActiveChildNav();
    if(childNav){
      if(childNav.getSelected() && childNav.getSelected().root === page.tabComponent){
        return 'primary';
      }
      return;
    }
    if(this.nav.getActive() && this.nav.getActive().name === page.pageName){
      return 'primary';
    }
  }

  async logOut(){
      await this.authProvider.logout();
      let params = {tabIndex: 0} 
      this._tab="HomePage";
      this.nav.setRoot("HomePage", params);
  }

  show(page){
    let isLoggedIn = (this.authProvider.token == null)? false : true;
    if(page.pageName == "SettingsPage"){
      return !isLoggedIn;
    }
    else if(page.tabComponent != undefined && (page.tabComponent == "LoginPage" || page.tabComponent == "RegisterPage")){
      return isLoggedIn;
    }
    else{
      return false;
    }
  }

}