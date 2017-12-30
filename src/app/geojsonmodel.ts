import {Feature} from './feature';

export class Geojsonmodel {
  constructor(public type: string,
              public features: [Feature]) {}
}
