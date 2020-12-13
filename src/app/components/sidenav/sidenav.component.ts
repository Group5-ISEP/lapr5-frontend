import { ChangeDetectorRef, Component } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
//import { UsersService } from 'src/app/services/users-services.service';

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {

	fillerNav = [
    { name: "Map", route: "/map", icon: "public" },
    //Add rest of elements in constructor, checking type of user
    { name: "Nodes", route: "/node", icon: "adjust" },
    { name: "Lines", route: "/line", icon: "sync_alt" },
    { name: "Paths", route: "/path", icon: "east" },
    { name: "Driver types", route: "/driver", icon: "account_box" },
    { name: "Vehicle types", route: "/vehicle", icon: "commute" },
    { name: "Import data file", route: "/populate", icon: "publish" }
	]

	isAdmin: boolean = false;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {  //private usersService: UsersService
/*		switch (localStorage.getItem('usertype')) {
			case "admin":
				this.fillerNav.push(
					{ name: "Create node", route: "/node", icon: "" },
					{ name: "Create line", route: "/line", icon: "" },
					{ name: "Create path", route: "/path", icon: "" },
					{ name: "Create driver type", route: "/drivertype", icon: "" },
					{ name: "Create vehicle type", route: "/vehivletype", icon: "" },
					{ name: "Import data file", route: "/import", icon: "" }
				);
			case "dataadmin":
				this.fillerNav.push(
					{ name: "Create node", route: "/node", icon: "" },
					{ name: "Create line", route: "/line", icon: "" },
					{ name: "Create path", route: "/path", icon: "" },
					{ name: "Create driver type", route: "/drivertype", icon: "" },
					{ name: "Create vehicle type", route: "/vehivletype", icon: "" },
					{ name: "Import data file", route: "/import", icon: "" }
				);
			case "user":
				this.fillerNav.push(
					{ name: "Create node", route: "/node", icon: "" },
					{ name: "Create line", route: "/line", icon: "" },
					{ name: "Create path", route: "/path", icon: "" },
					{ name: "Create driver type", route: "/drivertype", icon: "" },
					{ name: "Create vehicle type", route: "/vehivletype", icon: "" },
					{ name: "Import data file", route: "/import", icon: "" }
				);
		}
    */
  }
  shouldRun = true;
}
