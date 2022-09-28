import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MachinesService } from '../services/machines.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  @ViewChild('dialogScanMachine', { static: true }) dialogScanMachine!: TemplateRef<any>;
  dialogRef: MatDialogRef<TemplateRef<any>> | undefined;

  displayedColumnsEventslog = ['name', 'message', 'type']
  dataSourceEventslog = new MatTableDataSource()
  displayedColumnsSoftwares = ['name', 'version', 'publisher']
  dataSourceSoftwares = new MatTableDataSource()
  id !: string | null
  errorScan = null
  spinner = false
  success = false
  scan: any
  machine : any


  constructor(private router: Router, private activatedRoute: ActivatedRoute, private machineService: MachinesService, public dialog: MatDialog) {
    this.router.events.subscribe(
      ev => {
        if (ev instanceof NavigationEnd) {
          if (this.activatedRoute.snapshot.paramMap.get("id")) {
            this.id = this.activatedRoute.snapshot.paramMap.get("id")
            this.getLastScanMachine(this.id)
            this.getMachine(this.id)
          }
        }
      }
    )
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.paramMap.get("id")) {
      this.id = this.activatedRoute.snapshot.paramMap.get("id")
      this.getLastScanMachine(this.id)
      this.getMachine(this.id)
    }
  }

  getMachine(id: string | null){
    this.machineService.getMachine(id).subscribe(data => {
      this.machine = data
    },
      error => {
        console.log(error);
      })
  }

  getLastScanMachine(id: string | null) {
    this.machineService.getLastScanMachine(id).subscribe(data => {
      this.scan = data
      this.dataSourceEventslog = data.eventlog
      this.dataSourceSoftwares = data.softwares
    },
      error => {
        console.log(error);
      })
  }

  scanMachine() {
    this.spinner = true;
    this.openDialog()
    if (this.activatedRoute.snapshot.paramMap.get("id")) {
      this.id = this.activatedRoute.snapshot.paramMap.get("id")
      this.getLastScanMachine(this.id)
    }

    this.machineService.scanMachine(this.id).subscribe(data => {
      this.spinner = false
      this.success = true
      this.errorScan = null
      this.getLastScanMachine(this.id)

    },
      error => {
        this.spinner = false
        this.errorScan = error.error.message
      })
  }

  openDialog() {
    this.dialogRef = this.dialog.open(this.dialogScanMachine);
  }

  closeDialog() {
    this.errorScan = null
    this.dialogRef?.close()
  }


}
