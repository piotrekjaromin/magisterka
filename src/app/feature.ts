import {Properties} from './properties';
import {Geometry} from './geometry';

export class Feature {
  constructor(public type: string,
              public id: string,
              public properties: Properties,
              public geometry: Geometry
  ){}
}
