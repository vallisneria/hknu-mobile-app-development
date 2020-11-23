import { Location } from '../home-list/home-list.component';
import { Component, OnInit, Input } from '@angular/core';
import { Loc8rDataService } from "../loc8r-data.service";

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

  constructor(private loc8rDataService: Loc8rDataService) { }

  ngOnInit(): void {
  }

  public formError: string;

  private formIsValid(): boolean {
    return Boolean(this.newReview.author && this.newReview.rating && this.newReview.reviewText);
  }

  private resetAndHideReviewForm(): void {
    this.formVisible = false;
    this.newReview.author = "";
    this.newReview.rating = 5;
    this.newReview.reviewText = "";
  }

  public onReviewSubmit(): void {
    this.formError = '';
    if (this.formIsValid()) {
      console.log(this.newReview);
      this.loc8rDataService.addReviewByLocationId(this.location._id, this.newReview)
        .then(review => {
          console.log('Review Saved', review)
          let reviews = this.location.reviews.slice(0);
          reviews.unshift(review);
          this.resetAndHideReviewForm();
        });

    } else {
      this.formError = 'All fields required, please try again.'
    }
  }

}
