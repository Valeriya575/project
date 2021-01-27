import { Component, OnInit } from '@angular/core';
import { Bus } from 'src/app/models/bus';
import { BusService } from 'src/app/services/bus.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.css']
})
export class BusComponent implements OnInit {
  buses: Bus[];
  allBuses: Bus[];
  listInitialized = false;

  constructor(
    private busService: BusService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getBuses();
  }

  async getBuses() {
    await this.busService.getBuses().subscribe(buses => this.buses = buses);
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

  redirectToDetails(busId: string) {
    this.router.navigate(['/bus-details', busId]);
  }
}
