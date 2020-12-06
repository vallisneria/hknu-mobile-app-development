import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from "../authentication.service";
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public formError: string = '';

  public credentals = { name: '', email: '', password: '' };

  public pageContent = {
    header: {
      title: 'Create an account',
      strapline: ''
    },
    sidebar: ''
  }

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private historyService: HistoryService
  ) { }

  ngOnInit(): void {
  }

  public onRegisterSubmit(): void {
    this.formError = '';
    if (!this.credentals.name || !this.credentals.email || !this.credentals.password) {
      this.formError = 'All fields are required, please try again';
    } else {
      this.doRegister();
    }
  }

  private doRegister(): void {
    this.authenticationService.register(this.credentals)
      .then(() => this.router.navigateByUrl(this.historyService.getLastNonLoginUrl()))
      .catch((message) => this.formError = message);
  }
}
