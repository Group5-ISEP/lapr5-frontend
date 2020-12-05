import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './components/register/register.component';
import { PopulateComponent } from './components/populate/populate.component';
import { NodeComponent } from './components/node/node.component';
import { LineComponent } from './components/line/line.component';
import { PathComponent } from './components/path/path.component';
import { DriverTypeComponent } from './components/driver-type/driver-type.component';
import { VehicleTypeComponent } from './components/vehicle-type/vehicle-type.component';
import { MapComponent } from './components/map/map.component';
import { LoginComponent } from './components/login/login.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'driver', component: DriverTypeComponent },
  { path: 'vehicle', component: VehicleTypeComponent },
  { path: 'map', component: MapComponent },
  { path: 'populate', component: PopulateComponent },
  { path: 'node', component: NodeComponent },
  { path: 'line', component: LineComponent },
  { path: 'path', component: PathComponent }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
