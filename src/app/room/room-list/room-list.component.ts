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
  paginationInfo: any;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private repository: RoomRepositoryService, private errorHandler: ErrorHandlerService, public router: Router) { }

  ngOnInit(): void {
    this.getAllRooms();
  }

  private getAllRooms = () => {
    const apiAddress: string = `api/rooms?PageNumber=${this.currentPage}&PageSize=${this.pageSize}`;
    this.repository.getRooms(apiAddress)
    .subscribe({
      next: (res) => 
        {
          this.rooms = res.body;
          this.paginationInfo = JSON.parse(res.headers.get('x-pagination'));
        },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

  public getRoomDetails = (id) => {
    const detailsUrl: string = `room/details/${id}`;
    this.router.navigate([detailsUrl])
  }

  public redirectToUpdatePage = (id) => {
    const updateUrl: string = `/room/update/${id}`;
    this.router.navigate([updateUrl]);
  }

  public redirectToDeletePage = (id) => {
    const deleteUrl: string = `/room/delete/${id}`;
    this.router.navigate([deleteUrl]);
  }

  public changePage(newPage: number): void {
    this.currentPage = newPage;
    this.getAllRooms();
  }

  public nextPage(): void {
    if (this.paginationInfo.HasNext) {
      this.currentPage++;
      this.getAllRooms();
    }
  }

  public previousPage(): void {
    if (this.paginationInfo.HasPrevious) {
      this.currentPage--;
      this.getAllRooms();
    }
  }

}
