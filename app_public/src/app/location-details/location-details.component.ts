import { Location, Review } from '../location';
import { Component, OnInit, Input } from '@angular/core';
import { Loc8rDataService } from "../loc8r-data.service";
import { AuthenticationService } from "../authentication.service";

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {

  @Input() location: Location;

  public newReview: Review = {
    author: '',
    rating: 5,
    reviewText: ''
  }

  public googleAPIKey: string = ''

  public formVisible: boolean = false;

  constructor(
    private loc8rDataService: Loc8rDataService,
    private authenticationService: AuthenticationService
  ) { }

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
    this.newReview.author = this.getUsername();
    if (this.formIsValid()) {
      console.log(this.newReview);
      this.loc8rDataService.addReviewByLocationId(this.location._id, this.newReview)
        .then((review: Review) => {
          console.log('Review Saved', review)
          let reviews = this.location.reviews.slice(0);
          reviews.unshift(review);
          this.resetAndHideReviewForm();
        });

    } else {
      this.formError = 'All fields required, please try again.'
    }
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public getUsername(): string {
    const user = this.authenticationService.getCurrentUser();
    return user.name ? user.name : 'Guest';
  }

}
