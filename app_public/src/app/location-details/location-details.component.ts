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

  public formError: string;

  private formIsValid(): boolean {
    return Boolean(this.newReview.author && this.newReview.rating && this.newReview.reviewText);
  }

  public onReviewSubmit(): void {
    this.formError = '';
    if (this.formIsValid()) {
      console.log(this.newReview);
    } else {
      this.formError = 'All fields required, please try again.'
    }
    console.log(this.newReview);
  }

}
