import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('sidenav') public sidenav!: MatSidenav;
  title = 'frontend';
  loggedIn = false

  constructor(public auth: AuthenticationService) {

    this.auth.isUserLoggedIn.subscribe(value => {
      this.loggedIn = value;
      if (this.loggedIn) {
        this.getUserProfile()
      }
    });
  }


  getUserProfile() {
    //buscar profile
  }
}
