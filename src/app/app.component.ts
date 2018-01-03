import {Component, OnInit} from '@angular/core';
import {geoJSON, TileLayer} from 'leaflet';
import {DataService} from './data.service';
import {Geojsonmodel} from './geojsonmodel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  onlyStreetGeoModel: Geojsonmodel  = null
  options = null;
  mainLayer: TileLayer;
  fullGeoLayer = null
  onlyStreetGeoLayer = null;
  layersControl = null;
  layers = null;
  layers2 = null;


  constructor(private dataService: DataService) {
  }


  ngOnInit(): void {
    this.dataService.getJson().subscribe(data => {
      this.fullGeoLayer = geoJSON(data.json());
      this.onlyStreetGeoModel = this.dataService.getOnlyStreet(data.json());
      this.onlyStreetGeoLayer = geoJSON(JSON.parse(JSON.stringify(this.onlyStreetGeoModel)));

      this.mainLayer = this.dataService.prepareMainLayer();


      this.layers2 = this.dataService.prepareMarkersLayer2(this.onlyStreetGeoModel.features);
      console.log(this.layers2);

      this.options = this.dataService.prepareOptions(this.mainLayer);
      this.layersControl = {
        baseLayers: {
          'Open Street Map': this.mainLayer
        },
        overlays: {
          'All objects': this.fullGeoLayer,
          'Only street': this.onlyStreetGeoLayer,
          'Markers': this.dataService.prepareMarkersLayer2(this.onlyStreetGeoModel.features)
        }
      };
    });
  }
}
