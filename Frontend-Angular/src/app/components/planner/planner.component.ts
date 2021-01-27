import { Component, OnInit } from '@angular/core';

import { Arrival } from 'src/app/models/line';
import { Station } from 'src/app/models/station';
import { Bus } from 'src/app/models/bus';
import { UserDetails } from 'src/app/models/user';

import { LinesService } from 'src/app/services/lines.service';
import { StationsService } from 'src/app/services/stations.service';
import { BusService } from 'src/app/services/bus.service';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class PlannerComponent implements OnInit {
  lines: Arrival[];
  stationList: Station[] = [];
  busList: Bus[] = [];
  selectedStation: Station;
  selectedBus: Bus;
  user = new UserDetails();
  dayTypeList = [ 'All', 'Delavnik', 'Sobota', 'Nedelja in prazniki' ];
  selectedDayType = '';
  selectedDate: Date;

  constructor(
    private linesService: LinesService,
    private stationService: StationsService,
    private busService: BusService,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.update();
  }

  update() {
    this.getStations();
    this.getBuses();
    if (this.authService.token) {
      this.getUser();
    }
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

  async getLines() {
    await this.linesService.getLines(this.selectedStation.id, this.selectedBus.id).subscribe(lines => this.lines = lines);
  }

  filterResults() {
    if (this.selectedDate) {
      const selectedHours = this.selectedDate.getHours();
      const selectedMinutes = this.selectedDate.getMinutes();

      for (let i = 0; i < this.lines.length; i++) {
        const result = this.lines[i].arrivalTimes.filter((_) => {
          return new Date(_).getHours() === selectedHours && new Date(_).getMinutes() === selectedMinutes;
        });
        this.lines[i].arrivalTimes = result;
      }
    }

    if (this.selectedDayType !== '' && this.selectedDayType !== 'All') {
      const filtered = this.lines.filter((_) => {
        return _.dayType === this.selectedDayType;
      });
      this.lines = filtered;
    }
  }

  selectStation(stationId: number) {
    this.selectedStation = this.stationList.find(_ => _.id === stationId);
  }

  selectBus(busId: string) {
    this.selectedBus = this.busList.find(_ => _.id === busId);
  }

  gotoStationDetails(stationId: number) {
    this.router.navigate(['/station-details', stationId]);
  }

  gotoBusDetails(busId: string) {
    this.router.navigate(['/bus-details', busId]);
  }
}
