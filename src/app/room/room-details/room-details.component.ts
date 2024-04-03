import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Room } from './../../_interfaces/room.model';
import { Router, ActivatedRoute } from '@angular/router';
import { RoomRepositoryService } from './../../shared/services/room-repository.service';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit {
  room: Room;
  errorMessage: string = '';

  constructor(private repository: RoomRepositoryService, private router: Router, 
    private activeRoute: ActivatedRoute, private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.getRoomDetails();
  }

  getRoomDetails = () => {
    const id: string = this.activeRoute.snapshot.params['id'];
    const apiUrl: string = `api/rooms/${id}`;

    this.repository.getRoom(apiUrl)
    .subscribe({
      next: (res: Room) => this.room = res,
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
      }
    })
  }
}
