import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { AddmachineComponent } from './components/addmachine/addmachine.component';
import { ProfileComponent } from './components/profile/profile.component';
import { JwtInterceptor } from './helpers/JwtInterceptor';
import { FormsModule } from '@angular/forms';


import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule} from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { InventarioComponent } from './inventario/inventario.component';
import {MatTableModule} from '@angular/material/table'





@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    AddmachineComponent,
    ProfileComponent,
    InventarioComponent,
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    HttpClientModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    BrowserAnimationsModule,
    MatTooltipModule, 
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule
  
  ],
  providers: [HomepageComponent,{
    provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
