import { Component, OnInit } from '@angular/core';

import { Station } from 'src/app/models/station';
import { StationsService } from 'src/app/services/stations.service';
import { Router } from '@angular/router';

declare var ol: any;
@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})
export class StationsComponent implements OnInit {
  stations: Station[];
  map: any;
  vectorSource: any;

  latitude: number = 46.056946;
  longitude: number = 14.505751;

  constructor(
    private stationService: StationsService,
    private router: Router
    ) { }

  ngOnInit() {

    this.map = new ol.Map({
            target: 'map',
            layers: [
              new ol.layer.Tile({
                source: new ol.source.OSM()
              })
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat([this.longitude, this.latitude]),
              zoom: 15
            })
          });

    this.vectorSource = new ol.source.Vector({
      features: []
    });

    var vectorLayer = new ol.layer.Vector({
        source: this.vectorSource
    });

    this.map.addLayer(vectorLayer);

    this.getStations();
  }

  async getStations() {
    await this.stationService.getStations().subscribe(
      (stations) => {this.stations = stations;

      //foreach station in stationService
      this.stations.forEach((station) => {
        this.addMarker(station.location.lon, station.location.lat, this.vectorSource);
      });
      ///addMarker(station.location.lon, station.location.lot, this.vectorSource)

}


    );
  }

  redirectToDetails(stationId: string) {
    this.router.navigate(['/station-details', stationId]);
  }

  addMarker(longitude, latitude, vectorSource) {


    var geoMarker = new ol.Feature({
      type: 'geoMarker',
      geometry: new ol.geom.Point(
      ol.proj.transform([longitude,latitude], 'EPSG:4326', 'EPSG:3857') )
    });

    // specific style for that one point
        geoMarker.setStyle(new ol.style.Style({
          image: new ol.style.Icon({
            /*anchor: [0.5, 46],
            size:[10,10],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',*/
            opacity: 1,
            //size : [1000,1000],
            scale:0.2,
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Map_marker_font_awesome.svg/200px-Map_marker_font_awesome.svg.png'

            // the real size of your icon


          })
        }));

        //add geoMarker to vectorSource
        vectorSource.addFeature(geoMarker);

   }

}
