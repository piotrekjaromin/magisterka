import {Injectable} from '@angular/core';

import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Geojsonmodel} from './geojsonmodel';
import {Feature} from './feature';
import {GeoJsonObject} from 'geojson';
import {latLng, tileLayer, TileLayer} from 'leaflet';

@Injectable()
export class DataService {

  constructor(private http: Http) {
  }

  getJson() {
    return this.http.get('../assets/map.geojson');
  }

  getOnlyStreet(geoModel: Geojsonmodel): GeoJsonObject {
    const features: [Feature] = geoModel.features;
    const filteredFeatures: [Feature] = <[Feature]>[];
    for (const feature of features) {
      if (
        feature.geometry.type === 'LineString'
        && feature.properties.route !== 'bicycle'
        && feature.properties.route !== 'hiking'
        && feature.properties.route !== 'bus'
        && feature.properties.highway !== 'path'
        && feature.properties.highway !== 'cycleway'
        && feature.properties.highway !== 'footway'
        && feature.properties.highway !== 'track'
        && feature.properties.highway !== 'steps'
        && feature.properties.highway !== 'proposed'
        // && feature.properties.highway !== 'residential'// to remove
        // && feature.properties.surface !== 'asphalt'// to remove
        && feature.properties.natural === undefined
        && feature.properties.barrier === undefined
        && feature.properties.waterway === undefined
        && feature.properties.highway !== 'tertiary'
        // && feature.properties.highway !== 'living_street' // to remove
        && feature.properties.location !== 'overhead'
        && feature.properties.location !== 'underground'
        && feature.properties.traffic_calming !== 'island'
        && feature.properties.railway === undefined
        && feature.properties.man_made === undefined
        && feature.properties.highway !== 'pedestrian'
        && feature.properties.boundary === undefined
        && feature.properties.construction !== 'footway'
        && feature.properties.landcover !== 'grass'
        && feature.properties.service !== 'parking_aisle'
        && feature.properties.type !== 'parking_fee'
      ) {
        filteredFeatures.push(feature);
      }
    }
    geoModel.features = filteredFeatures;
    const geoObject: GeoJsonObject = JSON.parse(JSON.stringify(geoModel));
    return geoObject;
  }

  prepareMainLayer() {
    return tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      detectRetina: true
    });
  }

  prepareOptions(layer: TileLayer) {
    return  {
      layers: [
        layer
      ],
      zoom: 15,
      center: latLng([50.034279, 19.894034]),
      legend: {
        position: 'bottomleft',
        colors: ['#ff0000', '#28c9ff', '#0000ff', '#ecf386'],
        labels: ['National Cycle Route', 'Regional Cycle Route', 'Local Cycle Network', 'Cycleway']
      },
    };
  }

}
