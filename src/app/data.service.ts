import {Injectable} from '@angular/core';

import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Geojsonmodel} from './geojsonmodel';
import {Feature} from './feature';
import {GeoJsonObject} from 'geojson';
import {icon, latLng, LayerGroup, marker, Marker, tileLayer, TileLayer} from 'leaflet';
import {Geometry} from "./geometry";

@Injectable()
export class DataService {

  constructor(private http: Http) {
  }

  getJson() {
    return this.http.get('../assets/map_small.geojson');
  }

  getOnlyStreet(geoModel: Geojsonmodel): Geojsonmodel {
    const features: [Feature] = geoModel.features;
    const filteredFeatures: [Feature] = <[Feature]>[];
    const filteredFeatures2: [Feature] = <[Feature]>[];
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
    // filteredFeatures2.push(filteredFeatures[3]);
    // console.log(filteredFeatures[3].geometry.coordinates);
    geoModel.features = filteredFeatures;
    // const geoObject: GeoJsonObject = JSON.parse(JSON.stringify(geoModel));
    return geoModel;
  }

  prepareMarkersLayer2(features: [Feature]): LayerGroup{


    var markers: [Marker] = <[Marker]>[];
    for(let feature of features) {
      for(var i = 0;  i < feature.geometry.coordinates.length - 1; i++ ) {

        let x0 = feature.geometry.coordinates[i][0];
        let x1 = feature.geometry.coordinates[i + 1][0];
        if (x0 > x1) {
          const tmp = x0;
          x0 = x1;
          x1 = tmp;
        }
        let y0 = feature.geometry.coordinates[i][1];
        let y1 = feature.geometry.coordinates[i + 1][1];
        if (y0 > y1) {
          const tmp = y0;
          y0 = y1;
          y1 = tmp;
        }
        const xLenght = x1 - x0;
        const yLength = y1 - y0;

        const streetLength = Math.sqrt(Math.pow(xLenght, 2) + Math.pow(yLength, 2));
        markers.push(marker([y1 - (yLength / 2), x1 - (xLenght / 2) ], {
            icon: icon({
                iconSize: [25, 41],
                iconAnchor: [13, 41],
                iconUrl: 'assets/marker-icon.png',
                shadowUrl: 'assets/marker-shadow.png'
              }
            )
          }
          )
        );
      }
    }
    return new LayerGroup(markers);
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
        layer]
      ,
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
