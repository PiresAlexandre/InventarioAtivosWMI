import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddmachineComponent } from './components/addmachine/addmachine.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { InventarioComponent } from './inventario/inventario.component';


const routes: Routes = [
  { path: '', component: HomepageComponent},
  { path: 'client', component: HomepageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'add-machine', component: AddmachineComponent},
  { path: 'view-profile', component: ProfileComponent},
  { path: 'inventario/:id', component: InventarioComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
