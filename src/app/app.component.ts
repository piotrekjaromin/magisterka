import {Component, OnInit} from '@angular/core';
import {geoJSON, TileLayer} from 'leaflet';
import {DataService} from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  options = null;
  mainLayer: TileLayer;
  fullGeoLayer = null
  onlyStreetGeoLayer = null;
  layersControl = null;

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {

    this.mainLayer = this.dataService.prepareMainLayer();
    this.options = this.dataService.prepareOptions(this.mainLayer);

    this.dataService.getJson().subscribe(data => {
      this.fullGeoLayer = geoJSON(data.json());
      this.onlyStreetGeoLayer = geoJSON(this.dataService.getOnlyStreet(data.json()));

      this.layersControl = {
        baseLayers: {
          'Open Street Map': this.mainLayer
        },
        overlays: {
          'All objects': this.fullGeoLayer,
          'Only street': this.onlyStreetGeoLayer
        }
      };
    });
  }
}
