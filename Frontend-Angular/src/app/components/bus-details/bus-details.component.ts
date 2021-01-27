import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BusService } from 'src/app/services/bus.service';

import { Bus } from 'src/app/models/bus';

@Component({
  selector: 'app-bus-details',
  templateUrl: './bus-details.component.html',
  styleUrls: ['./bus-details.component.css']
})
export class BusDetailsComponent implements OnInit {
  busId: string;
  bus: Bus;

  constructor(
    private busService: BusService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(paramsId => {
      this.busId = paramsId.busId;
    });

    this.getBusDetails();
  }

  async getBusDetails() {
    await this.busService.getBusDetails(this.busId).subscribe(bus => this.bus = bus);
  }

}
