import { Component, Input, OnInit } from '@angular/core';
import { BusPassingTime, NodeTimetableDto } from 'src/app/domain/NodeTimetableDto';
import { TripService } from 'src/app/services/trip-service.service';
import Node from '../../domain/Node';

@Component({
  selector: 'app-node-map-info',
  templateUrl: './node-map-info.component.html',
  styleUrls: ['./node-map-info.component.css']
})
export class NodeMapInfoComponent implements OnInit {

  node: Node;

  timetable: BusPassingTime[];

  fetching = false;
  error = false;

  constructor(private tripService: TripService) { }

  ngOnInit(): void {
  }

  updateSchedule() {
    if (this.node) {
      console.log("Fetching schedule...");
      this.fetching = true;
      this.error = false;


      this.tripService.getScheduleByNode(this.node.shortName)
        .subscribe((data: NodeTimetableDto) => {
          try {
            this.timetable = data.schedule
              .sort((bus, other) => {
                if (bus.timeInstant < other.timeInstant)
                  return -1;
                return 1;
              })

            this.fetching = false;

          } catch (error) {
            this.fetching = false;
            this.error = true;
          }
        })


    }
  }

}
