import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MachinesService } from '../services/machines.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  
  displayedColumnsEventslog = ['name', 'message', 'type']
  dataSourceEventslog = new MatTableDataSource()
  displayedColumnsSoftwares = ['name', 'version', 'publisher']
  dataSourceSoftwares = new MatTableDataSource()
  disks = []

  softwares = [
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
    { name: 'alex', version: 'xexde', publisher: 'alexjxe' },
  ]

  eventslog = [
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },
    { name: 'alex', message: 'xexde', type: 'alexjxe' },

  ]

  scan = 
    { system_type: 1, user: 2, operative_system: 3, manufacturer: 3, model: 4, memory: 4, processor: 4, motherboard: 5, graphic: 5, disks: 5 }
  

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private machineService: MachinesService) { 
    this.router.events.subscribe(
      ev=>{
        if(ev instanceof NavigationEnd){
          var id = this.activatedRoute.snapshot.paramMap.get("id")
          this.getLastScanMachine(id)
        }
      }
    )
  }

  ngOnInit(): void {
    // this.dataSourceSoftwares.data = this.softwares
    // this.dataSourceEventslog.data = this.eventslog
  }

  getLastScanMachine(id: string | null){
    this.machineService.getLastScanMachine(id).subscribe(data=>{
       this.scan = data
       this.dataSourceEventslog = data.eventslog
       this.dataSourceSoftwares = data.softwares
       this.disks = data.disks
       
          },
    error=>{
      console.log(error);
      
    })
  }


}
