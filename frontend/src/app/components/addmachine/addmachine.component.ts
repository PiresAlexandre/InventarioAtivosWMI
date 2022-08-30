import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MachinesService } from 'src/app/services/machines.service';

@Component({
  selector: 'app-addmachine',
  templateUrl: './addmachine.component.html',
  styleUrls: ['./addmachine.component.css']
})
export class AddmachineComponent implements OnInit {
  ip!: string;
  username!: string;
  password!: string;

  error: string | null = null;;


  constructor(private machines: MachinesService, private router: Router) { }

  ngOnInit(): void {
  }

  machine(){

     this.machines.machines(this.ip, this.username, this.password)
       .subscribe(
         data => {       
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.router.navigate(['profile'])
            
         },
        error => {
         console.log(error.error.message);
        
         }
         
        
      )


  }

}
