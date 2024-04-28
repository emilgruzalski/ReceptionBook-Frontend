import { Component, OnInit } from '@angular/core';

import { Reservation } from './../../_interfaces/reservation.model';
import { ReservationRepositoryService } from './../../shared/services/reservation-repository.service';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[];
  errorMessage: string = '';
  paginationInfo: any;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private repository: ReservationRepositoryService, private errorHandler: ErrorHandlerService, public router: Router) { }

  ngOnInit(): void {
    this.getAllReservations();
  }

  private getAllReservations = () => {
    const apiAddress: string = `api/reservations?PageNumber=${this.currentPage}&PageSize=${this.pageSize}`;
    this.repository.getReservations(apiAddress)
    .subscribe({
      next: (res) => {
        this.reservations = res.body;
        this.paginationInfo = JSON.parse(res.headers.get('x-pagination'));
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

  public getReservationDetails = (id) => {
    const detailsUrl: string = `reservation/details/${id}`;
    this.router.navigate([detailsUrl])
  }

  public redirectToDeletePage = (id) => {
    const deleteUrl: string = `/reservation/delete/${id}`;
    this.router.navigate([deleteUrl]);
  }

  public redirectToUpdatePage = (id) => {
    const updateUrl: string = `/reservation/update/${id}`;
    this.router.navigate([updateUrl]);
  }

  public changePage(newPage: number): void {
    this.currentPage = newPage;
    this.getAllReservations();
  }

  public nextPage(): void {
    if (this.paginationInfo.HasNext) {
      this.currentPage++;
      this.getAllReservations();
    }
  }

  public previousPage(): void {
    if (this.paginationInfo.HasPrevious) {
      this.currentPage--;
      this.getAllReservations();
    }
  }
}
