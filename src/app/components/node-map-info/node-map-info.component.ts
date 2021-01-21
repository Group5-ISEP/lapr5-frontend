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

  constructor(private tripService: TripService) { }

  ngOnInit(): void {
  }

  updateSchedule() {
    if (this.node) {
      console.log("Fetching schedule...");
      this.tripService.getScheduleByNode(this.node.shortName)
        .subscribe((data: NodeTimetableDto) => {
          this.timetable = data.schedule
            .sort((bus, other) => {
              if (bus.timeInstant < other.timeInstant)
                return -1;
              return 1;
            })
        })
    }
  }

}
