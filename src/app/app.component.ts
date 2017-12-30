import {Component, OnInit} from '@angular/core';
import {geoJSON, GeoJSON, latLng, tileLayer} from 'leaflet';
import {DataService} from './data.service';
import {GeoJsonObject} from 'geojson';
import {Geojsonmodel} from './geojsonmodel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  geojsonObj: GeoJsonObject;
  options = null;
  geojsonFromDB: Geojsonmodel;

  constructor(private dataService: DataService) { }
  ngOnInit(): void {
    this.dataService.getJson().subscribe(data => {
      console.log(data.json());
      // this.geojsonObj = data.json();
      this.geojsonFromDB = data.json();
      this.geojsonObj = JSON.parse(JSON.stringify(this.geojsonFromDB));
      this.options = {
        layers: [
          geoJSON(this.geojsonObj),
          tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            subdomains: ['a', 'b', 'c'],
            detectRetina: true
          })
        ],
        zoom: 7,
        center: latLng([ 50.0614300, 19.9365800 ]),
        legend: {
          position: 'bottomleft',
          colors: [ '#ff0000', '#28c9ff', '#0000ff', '#ecf386' ],
          labels: [ 'National Cycle Route', 'Regional Cycle Route', 'Local Cycle Network', 'Cycleway' ]
        },
      };

    });
  }
}
