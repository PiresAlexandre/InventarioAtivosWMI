import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 email!: string;
 password!: string;
 error: string | null = null;

  constructor(private auth: AuthenticationService, private router: Router, public userService: UserService) {
 
  }

  ngOnInit(): void {
  }

  login() {
    this.auth.login(this.email, this.password)
      .subscribe(
        data => {       
         localStorage.setItem('currentUser', JSON.stringify(data));
         this.router.navigate(['profile'])
            
        },
        error => {
         console.log(error.error.message);
         if(error.status == 401){
          if(error.error.message === "Email don't exist"){
            this.error = "Email não existe"
          }
          if(error.error.message === "Password Incorrect"){
            this.error = "Palavra-passe incorreta"
          }
         }
         
        }
      )



  }
}
