import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('select') select!: MatSelect;

 email!: string;
 password!: string;
 error: string | null = null;
  loginForm: FormGroup;
  registerForm: FormGroup;
  toggle: boolean;
  activeLogin = 'nav-link active';
  activeRegister = 'nav-link ';
  hide = true;

  constructor(private auth: AuthenticationService, private router: Router, public userService: UserService, private fb: FormBuilder,) {
    this.toggle = false;
    
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      first_name: ['', Validators.required ],
      last_name: ['', Validators.required ],
      email: ['', Validators.required],
      phoneNumber: ['',Validators.required],
      password: ['',Validators.required],
    
    
    });
  }

  toggleRegister() {
    this.toggle = true;
    this.activeLogin = 'nav-link ';
    this.activeRegister = 'nav-link active';
    this.loginForm.reset();
  }

  toggleLogin() {
    this.toggle = false;
    this.activeLogin = 'nav-link active';
    this.activeRegister = 'nav-link ';
    this.registerForm.reset();
  }

  ngOnInit(): void {
  }

  login() {
    this.auth.login(this.email, this.password)
      .subscribe(
        data => {       
         localStorage.setItem('currentUser', JSON.stringify(data));
         this.auth.isUserLoggedIn.next(true)
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

  register() {
    
  //   user.age = this.registerForm.value.typeAge;
  //   user.readerType = this.registerForm.value.typeBooks;
  //   this.authService.registerClient(user).subscribe(
  //     (data) => {
  //       if (data.success) {
  //         this.errorRegister = undefined;
  //         this.toggleLogin();
  //       }
  //     },
  //     (error) => {
  //       this.errorRegister = error.error;
  //     }
  //   );
  }
}
