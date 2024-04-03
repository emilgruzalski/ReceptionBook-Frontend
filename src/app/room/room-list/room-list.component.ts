import { Component, OnInit } from '@angular/core';

import { Room } from './../../_interfaces/room.model';
import { RoomRepositoryService } from './../../shared/services/room-repository.service';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  rooms: Room[];
  errorMessage: string = '';

  constructor(private repository: RoomRepositoryService, private errorHandler: ErrorHandlerService, private router: Router) { }

  ngOnInit(): void {
    this.getAllRooms();
  }

  private getAllRooms = () => {
    const apiAddress: string = 'api/rooms';
    this.repository.getRooms(apiAddress)
    .subscribe({
      next: (res: Room[]) => this.rooms = res,
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
      }
    })
  }

  public getRoomDetails = (id) => {
    const detailsUrl: string = `room/details/${id}`;
    this.router.navigate([detailsUrl])
  }

}
