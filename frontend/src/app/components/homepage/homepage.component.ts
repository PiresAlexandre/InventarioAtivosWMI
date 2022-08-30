import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';


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

  error!: string;

  constructor(private auth: AuthenticationService, private router: Router) {

  }

  ngOnInit(): void {
  }

  registerUser() {   
    this.auth.registerUser(this.first_name, this.last_name, this.phone_number, this.email, this.password)
      .subscribe(
        data => {
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.router.navigate(['addmachine'])

        },
        error => {
          console.log(error.error.message);
          if (error.status = 400) {
            if (error.error.message === "First name is invalid") {
              this.error = "Primeiro nome inválido"
            } if (error.error.message === "Last name is invalid") {
              this.error = "Ultimo nome inválido"
            } if (error.error.message === "Phone number is invalid") {
              this.error = "Nº telemóvel errado"
            } if (error.error.message === "Email is invalid") {
              this.error = "Email inválido"
            }if (error.error.message === "Password must contain at least 8 caracters, one uppercase, one lowercase and one number") {
              this.error = "Password deve conter ao menos 8 caracteres, 1 maiuscula, 1 minúscula e um número"
          }
          }
        }
      )

  }

}
