import {Injectable} from '@angular/core';

import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Geojsonmodel} from './geojsonmodel';
import {Feature} from './feature';
import {icon, latLng, LayerGroup, marker, Marker, tileLayer, TileLayer} from 'leaflet';
import {SpeedService} from './speed.service';

@Injectable()
export class DataService {

  constructor(private http: Http) {
  }

  getJson() {
    return this.http.get('../assets/map_medium.geojson');
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
    geoModel.features = filteredFeatures;
    return geoModel;
  }

  prepareMarkersLayer(features: [Feature]): LayerGroup {

    var markers: [Marker] = <[Marker]>[];

    for (let feature of features) {
      const arrayOfLengths = this.getStreetLength(feature.geometry.coordinates);
      const totalLengthOfStreet = arrayOfLengths[arrayOfLengths.length - 3];

      var currentLength = 0;
      var maxSpeed = SpeedService.getMaxSpeed(feature, totalLengthOfStreet * 111196.672);
      for (var i = 0; i < arrayOfLengths.length; i += 3) {
        currentLength += arrayOfLengths[i];

        if (currentLength >= (totalLengthOfStreet / 2)) {
          markers.push(marker([arrayOfLengths[i + 1], arrayOfLengths[i + 2]], {
            icon: icon({
              iconSize: [25, 25],
              iconAnchor: [0, 0],
              iconUrl: 'assets/' + maxSpeed + '.png'
            })
          }));
          break;
        }
      }
    }
    return new LayerGroup(markers);
  }

  private getStreetLength(coordinates: [[number, number]]): [number, number, number] {
    var arrayOfLength: [number, number, number] = <[number, number, number]>[];
    var totalLength = 0;

    for (var i = 0; i < coordinates.length - 1; i++) {
      let x0 = coordinates[i][0];
      let x1 = coordinates[i + 1][0];

      if (x0 > x1) {
        const tmp = x0;
        x0 = x1;
        x1 = tmp;
      }

      let y0 = coordinates[i][1];
      let y1 = coordinates[i + 1][1];

      if (y0 > y1) {
        const tmp = y0;
        y0 = y1;
        y1 = tmp;
      }

      const xLenght = x1 - x0;
      const yLength = y1 - y0;

      const length = Math.sqrt(Math.pow(xLenght, 2) + Math.pow(yLength, 2)); // length between two nearest coordinates
      const latCoordinate = y1 - (yLength / 2); // center latitude coordinate between two nearest coordinates
      const longCoordinate = x1 - (xLenght / 2); // center longitude coordinate between two nearest coordinates
      arrayOfLength.push(length, latCoordinate, longCoordinate);
      totalLength += length;
    }
    arrayOfLength.push(totalLength, 0, 0)
    return arrayOfLength;
  }


  prepareMainLayer() {
    return tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      detectRetina: true
    });
  }

  prepareOptions(layer: TileLayer) {
    return {
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
