
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MachinesService } from 'src/app/services/machines.service';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  first_name!: string
  last_name!: string
  phone_number!: string
  email!: string
  password!: string

  error: string | null | undefined;
  loggedIn = false

  constructor(private auth: AuthenticationService, private router: Router, private machineService: MachinesService) {
   
  }

  ngOnInit(): void {
    let currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    if (currentUser && currentUser.token) {
      this.loggedIn = true;
      this.router.navigate(['client'])
      this.getMachines()
    } else {
      this.loggedIn = false;
      this.router.navigate([''])
    }
  }

  getMachines() {
    this.machineService.getMachines().subscribe(
      data => {
        if (data.length > 0) {
          this.router.navigate(['/inventario/' + data[0]._id.$oid])
        }
      }, error => {
        console.log(error);

      })
  }
}
