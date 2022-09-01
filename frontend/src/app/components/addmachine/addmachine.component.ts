import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MachinesService } from 'src/app/services/machines.service';

@Component({
  selector: 'app-addmachine',
  templateUrl: './addmachine.component.html',
  styleUrls: ['./addmachine.component.css']
})


export class AddmachineComponent implements OnInit {
  @ViewChild('select') select!: MatSelect;

  error: string | null = null;
  registerForm: FormGroup;
  fb: any;
  hide = true;


  constructor(private auth: AuthenticationService, private router: Router) {

    this.registerForm = this.fb.group({
      ip: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],  
    });
   }

  ngOnInit(): void {
  }


  machine(){

     this.auth.registerMachine(this.registerForm.value)
       .subscribe(
         data => {       
  
         },
        error => {
         console.log(error.error.message);
        
         }
         
        
      )


  }

}
