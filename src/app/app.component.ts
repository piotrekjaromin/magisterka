import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {circle, geoJSON, TileLayer} from 'leaflet';
import {DataService} from './data.service';
import {Geojsonmodel} from './geojsonmodel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  onlyStreetGeoModel: Geojsonmodel  = null;
  options = null;
  mainLayer: TileLayer;
  fullGeoLayer = null;
  onlyStreetGeoLayer = null;
  layersControl = null;
  layers = null;

  fitBounds: any = null;
  circle = circle([ 46.95, -122 ], { radius: 50000000000 });


  constructor(private dataService: DataService, private changeDetector: ChangeDetectorRef) {
  }


  ngOnInit(): void {

    // this.circle.on('add', () => {
    //
    //   // Because we're outside of Angular's zone, this change won't be detected
    //   this.fitBounds = this.circle.getBounds();
    //
    //   // But, it will if we tell Angular to detect changes
    //   this.changeDetector.detectChanges();
    //
    //   console.log('In abc');
    //
    // });

    this.dataService.getJson().subscribe(data => {
      this.fullGeoLayer = geoJSON(data.json());
      this.onlyStreetGeoModel = this.dataService.getOnlyStreet(data.json());
      this.onlyStreetGeoLayer = geoJSON(JSON.parse(JSON.stringify(this.onlyStreetGeoModel)));

      this.mainLayer = this.dataService.prepareMainLayer();

      this.options = this.dataService.prepareOptions(this.mainLayer);
      this.layersControl = {
        baseLayers: {
          'Open Street Map': this.mainLayer
        },
        overlays: {
          'All objects': this.fullGeoLayer,
          'Only street': this.onlyStreetGeoLayer,
          'Markers': this.dataService.prepareMarkersLayer(this.onlyStreetGeoModel.features)
        }
      };
    });

  }

}
