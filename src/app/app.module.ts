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
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs'; 

import { LoginComponent } from './components/login/login.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { RegisterComponent } from './components/register/register.component';
import { PopulateComponent } from './components/populate/populate.component';
import { NodeComponent } from './components/node/node.component';
import { LineComponent } from './components/line/line.component';
import { PathComponent } from './components/path/path.component';
import { DriverTypeComponent } from './components/driver-type/driver-type.component';
import { VehicleTypeComponent } from './components/vehicle-type/vehicle-type.component';
import { MapComponent } from './components/map/map.component';
import { NodeelementComponent } from './components/nodeelement/nodeelement.component';
import { NodeListComponent } from './components/node-list/node-list.component';
import { LineListComponent } from './components/line-list/line-list.component';
import { PathListComponent } from './components/path-list/path-list.component';
import { CreateSegmentComponent } from './components/create-segment/create-segment.component';



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
    MapComponent,
    NodeelementComponent,
    NodeListComponent,
    LineListComponent,
    PathListComponent,
    CreateSegmentComponent
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
    MatSelectModule,
    MatButtonModule,
    MatExpansionModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule
  ],
//  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
