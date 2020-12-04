import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select'; 
import { AppComponent } from './app.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'; 

import { LoginComponent } from './login/login.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { RegisterComponent } from './register/register.component';
import { PopulateComponent } from './populate/populate.component';
import { NodeComponent } from './node/node.component';
import { LineComponent } from './line/line.component';
import { PathComponent } from './path/path.component';
import { DriverTypeComponent } from './driver-type/driver-type.component';
import { VehicleTypeComponent } from './vehicle-type/vehicle-type.component';
import { MapComponent } from './map/map.component';



@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    LoginComponent,
    RegisterComponent,
    PopulateComponent,
    NodeComponent,
    LineComponent,
    PathComponent,
    DriverTypeComponent,
    VehicleTypeComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    AppRoutingModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
    MatSelectModule
  ],
//  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
