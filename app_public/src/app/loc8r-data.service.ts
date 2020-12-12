import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Location, Review } from "./location";
import { User } from './user';
import { AuthResponse } from './authersponse';
import { BROWSER_STORAGE } from "./storage";


@Injectable({
  providedIn: 'root'
})
export class Loc8rDataService {
  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) { }

  private api_base_url = "http://loc8r-2018250038.herokuapp.com/api"

  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }

  public getLocations(lat: number, lng: number): Promise<Location[]> {
    const max_distance: number = 20000;
    const url: string = `${this.api_base_url}/locations?lng=${lng}&lat=${lat}&maxDistance=${max_distance}`;

    return this.http.get(url).toPromise().then(response => response as Location[]).catch(this.handleError)
  }

  public getLocationById(locationId: string): Promise<Location> {
    const url: string = `${this.api_base_url}/locations/${locationId}`;
    return this.http.get(url).toPromise().then(response => response as Location).catch(this.handleError);
  }

  public addReviewByLocationId(locationId: string, formData: Review): Promise<Review> {
    const url: string = `${this.api_base_url}/locations/${locationId}/reviews`;
    const httpOption = { headers: new HttpHeaders({ Authorization: `Bearer ${this.storage.getItem('loc8r-token')}` }) };
    return this.http.post(url, formData, httpOption).toPromise().then(response => response as any).catch(this.handleError);
  }

  public login(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user);
  }

  public register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user);
  }

  private makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url: string = `${this.api_base_url}/${urlPath}`;
    return this.http.post(url, user).toPromise().then(response => response as AuthResponse).catch(this.handleError);
  }
}
