import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { PopulateComponent } from './populate/populate.component';
import { NodeComponent } from './node/node.component';
import { LineComponent } from './line/line.component';
import { PathComponent } from './path/path.component';
import { DriverTypeComponent } from './driver-type/driver-type.component';
import { VehicleTypeComponent } from './vehicle-type/vehicle-type.component';
import { MapComponent } from './map/map.component';
import { LoginComponent } from './login/login.component';
import { SidenavComponent } from './sidenav/sidenav.component';


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
