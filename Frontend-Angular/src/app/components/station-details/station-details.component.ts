import { Component, OnInit } from '@angular/core';

import { Station } from 'src/app/models/station';

import { StationsService } from 'src/app/services/stations.service';
import { ActivatedRoute } from '@angular/router';

declare var ol: any;

@Component({
  selector: 'app-station-details',
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.css']
})
export class StationDetailsComponent implements OnInit {
  stationId: string;
  station: Station;
  map: any;
  vectorSource: any;
  latitude: number = 46.056946;
  longitude: number = 14.505751;

  constructor(
    private stationService: StationsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(paramsId => {
      this.stationId = paramsId.stationId;


    });



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

    this.getStationDetails();
  }

  async getStationDetails() {
    await this.stationService.getStationDetails(this.stationId).subscribe((station) => {
      this.station = station;
      this.addMarker(this.station.location.lon, this.station.location.lat, this.vectorSource);
      var view = this.map.getView();
      view.setCenter(ol.proj.fromLonLat([this.station.location.lon, this.station.location.lat]));
      //view.setZoom(15);



    });
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
