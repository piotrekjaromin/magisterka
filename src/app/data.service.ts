import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  constructor(private http: Http) { }

  getJson() {
    // this.http.get('map.geojson').subscribe(data => console.log(data.text()));
    // return this.http.get('../assets/map.geojson');
    // return this.http.get('../assets/map.geojson');
    return this.http.get('../assets/map_small.geojson');
  }
}
