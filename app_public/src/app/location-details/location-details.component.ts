import { Location } from '../home-list/home-list.component';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {

  @Input() location: Location;

  public newReview = {
    author: '',
    rating: 5,
    reviewText: ''
  }

  public googleAPIKey: string = ''

  public formVisible: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
