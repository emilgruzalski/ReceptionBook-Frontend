import { Component, OnInit } from '@angular/core';

import { Room } from './../../_interfaces/room.model';
import { RoomRepositoryService } from './../../shared/services/room-repository.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  rooms: Room[];

  constructor(private repository: RoomRepositoryService) { }

  ngOnInit(): void {
    this.getAllRooms();
  }

  private getAllRooms = () => {
    const apiAddress: string = 'api/rooms';
    this.repository.getRooms(apiAddress)
    .subscribe(res => {
      this.rooms = res;
    })
  }

}
