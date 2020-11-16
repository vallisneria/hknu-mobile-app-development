import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Location } from "./home-list/home-list.component";


@Injectable({
  providedIn: 'root'
})
export class Loc8rDataService {
  constructor(private http: HttpClient) { }

  private api_base_url = "http://localhost:3000/api"

  public getLocations(lat: number, lng: number): Promise<Location[]> {
    const max_distance: number = 20000;
    const url: string = `${this.api_base_url}/locations?lng=${lng}&lat=${lat}&maxDistance=${max_distance}`;

    return this.http.get(url).toPromise().then(response => response as Location[]).catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }
}
