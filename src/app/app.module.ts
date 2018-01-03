import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import {DataService} from './data.service';
import {SpeedService} from './speed.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    LeafletModule.forRoot()
  ],
  providers: [DataService, SpeedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
