import { Component, OnInit } from '@angular/core';
import { Loc8rDataService } from "../loc8r-data.service";
import { GeolocationService } from "../geolocation.service";

export class Location {
  id: string;
  name: string;
  distance: number;
  address: string;
  rating: number;
  facilities: string[];
  reviews: any[];
  coords: number[];
  openingTimes: any[];
}

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})
export class HomeListComponent implements OnInit {
  constructor(private loc8rDataService: Loc8rDataService,
    private geolocationService: GeolocationService) { }

  public locations: Location[];
  public message: string;

  ngOnInit(): void {
    this.getPosition();
  }

  private getPosition(): void {
    this.message = 'Getting your location...';
    this.geolocationService.getPosition(this.getLocations.bind(this), this.showError.bind(this), this.noGeo.bind(this));
  }

  private getLocations(position: any): void {
    this.message = 'searching for nearby places';
    const lat: number = position.coords.latitude;
    const lng: number = position.coords.longitude;
    this.loc8rDataService.getLocations(lat, lng)
      .then(foundlocations => {
        this.message = foundlocations.length > 0 ? '' : 'No location found';
        this.locations = foundlocations;
      })
  }

  private showError(error: any): void {
    this.message = error.message;
  }

  private noGeo(): void {
    this.message = 'Geolocation not supported by this browser.';
  }
}
