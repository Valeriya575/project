import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PlannerComponent } from './components/planner/planner.component';
import { StationsComponent } from './components/stations/stations.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileGuard } from './guards/profile.guard';
import { MapComponent } from './components/map/map.component';
import { BusComponent } from './components/bus/bus.component';
import { BusDetailsComponent } from './components/bus-details/bus-details.component';
import { StationDetailsComponent } from './components/station-details/station-details.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard] },
  { path: 'planner', component: PlannerComponent },
  { path: 'stations', component: StationsComponent },
  { path: 'buses', component: BusComponent },
  { path: 'maps', component: MapComponent },
  { path: 'bus-details/:busId', component: BusDetailsComponent },
  { path: 'station-details/:stationId', component: StationDetailsComponent },
  { path: '', redirectTo: '/planner', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
