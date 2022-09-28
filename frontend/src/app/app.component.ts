import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  @ViewChild('sidenav') public sidenav!: MatSidenav;
  title = 'frontend';
  loggedIn = false
  user_name = ""

  constructor(public activetedRoute: ActivatedRoute,private router: Router,  private userService: UserService, private auth : AuthenticationService) {

    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser')!);
        if (currentUser && currentUser.token) {          
          this.loggedIn = true;
          this.getProfile()
        }else{
          this.loggedIn = false;
        }
      } 
    });
  }

  getProfile(){
    this.userService.getProfile().subscribe(
      data => {
        this.user_name = data.first_name + ' ' + data.last_name        

      }, error => {
          console.log(error);
          
      })
  }

  logout(){
    this.auth.logout()
    this.router.navigate(['']);
  }
}
