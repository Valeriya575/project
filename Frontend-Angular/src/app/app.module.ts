import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PlannerComponent } from './components/planner/planner.component';
import { StationsComponent } from './components/stations/stations.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AppMaterialModule } from './app-material.module';

import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { ProfileComponent } from './components/profile/profile.component';
import { TokenInterceptor } from './interceptors/token-interceptor.service';
import { MapComponent } from './components/map/map.component';
import { BusComponent } from './components/bus/bus.component';
import { BusDetailsComponent } from './components/bus-details/bus-details.component';
import { StationDetailsComponent } from './components/station-details/station-details.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    PlannerComponent,
    StationsComponent,
    BusComponent,
    ProfileComponent,
    BusDetailsComponent,
    StationDetailsComponent,
    MapComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    DlDateTimePickerDateModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
