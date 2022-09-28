import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MachinesService } from 'src/app/services/machines.service';
import { SidenavServiceService } from 'src/app/services/sidenav-service.service';

@Component({
  selector: 'app-addmachine',
  templateUrl: './addmachine.component.html',
  styleUrls: ['./addmachine.component.css']
})


export class AddmachineComponent implements OnInit {
  error: string | null = null;
  registerForm: FormGroup;
  hide = true;


  constructor(private machineService: MachinesService, private router: Router, private fb: FormBuilder) {

    this.registerForm = this.fb.group({
      ip: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }


  machine() {

    this.machineService.addMachine(this.registerForm.value).subscribe(
      data => {
        this.router.navigate([''])

      }, error => {
          this.error = error.error.message
      })


  }

}
