import { Component, OnInit } from '@angular/core';

export class Location {
  _id: string;
  name: string;
  distance: number;
  address: string;
  rating: number;
  facilities: string[]
}

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})

export class HomeListComponent implements OnInit {
  constructor() { }

  locations: Location[] = [{
    _id: "5f6f424011dd734b3b63aad3",
    name: "Sushi",
    distance: 356321651,
    address: "경기도 김포시 김포2동 385-9",
    rating: 3,
    facilities: ["Premium wifi", "Water"]
  }, {
    _id: "5f6f424011dd734b3b63aad3",
    name: "Starcups",
    distance: 416542,
    address: "경기도 김포시 김포한강5로 385-9",
    rating: 4,
    facilities: ["Hot Drinks", "Wi-Fi"]
  }]

  ngOnInit(): void {
  }

}
