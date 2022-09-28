import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MachinesService } from 'src/app/services/machines.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  showMachines = true
  listMachines: any[] = []

  constructor(private machineService: MachinesService,public activetedRoute: ActivatedRoute,private router: Router) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser')!);
        if (currentUser && currentUser.token) {          
          this.getMachines()
        }else{
          this.listMachines = [];
        }
      } 
    });
   }

  ngOnInit(): void {
    this.getMachines()
  }

  getMachines(){
    this.machineService.getMachines().subscribe(
      data => {
        this.listMachines = data     

      }, error => {
          console.log(error);
          
      })
  }

  removeMachine(id: string | null){
    this.machineService.removeMachine(id).subscribe(
      data => {
        this.getMachines()    

      }, error => {
          console.log(error);
          
      })
    
  }
}
