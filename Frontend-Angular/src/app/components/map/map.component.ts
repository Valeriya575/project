import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var ol: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  latitude: number = 46.056946;
  longitude: number = 14.505751;

  map: any;

  constructor(private http: HttpClient) { }


  ngOnInit() {

    var map = new ol.Map({
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

        var vectorSource = new ol.source.Vector({
          features: []
        });

    	  var vectorLayer = new ol.layer.Vector({
    		    source: vectorSource
        });

    	  map.addLayer(vectorLayer);

    map.on('click', function (args) {
      console.log(args.coordinate);
      var lonlat = ol.proj.transform(args.coordinate, 'EPSG:3857', 'EPSG:4326');
      console.log(lonlat);

      var lon = lonlat[0];
      var lat = lonlat[1];
      alert(`lat: ${lat} long: ${lon}`);
    });

  }

  setCenter() {

    var view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat([this.longitude, this.latitude]));
    view.setZoom(15);

  }

  addMarker(longitude, latitude, vectorSource) {


    var geoMarker = new ol.Feature({
      type: 'geoMarker',
      geometry: new ol.geom.Point(
      ol.proj.transform([longitude,latitude], 'EPSG:4326', 'EPSG:3857') )
    });

        geoMarker.setStyle(new ol.style.Style({
          image: new ol.style.Icon({
            opacity: 1,
            scale:0.2,
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Map_marker_font_awesome.svg/200px-Map_marker_font_awesome.svg.png'

          })
        }));

        //add geoMarker to vectorSource
        vectorSource.addFeature(geoMarker);

   }


}
