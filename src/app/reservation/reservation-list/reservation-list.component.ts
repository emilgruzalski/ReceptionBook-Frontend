import { Component, OnInit } from '@angular/core';

import { Reservation } from './../../_interfaces/reservation.model';
import { ReservationRepositoryService } from './../../shared/services/reservation-repository.service';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[];
  errorMessage: string = '';

  constructor(private repository: ReservationRepositoryService, private errorHandler: ErrorHandlerService, private router: Router) { }

  ngOnInit(): void {
    this.getAllReservations();
  }

  private getAllReservations = () => {
    const apiAddress: string = 'api/reservations';
    this.repository.getReservations(apiAddress)
    .subscribe({
      next: (res: Reservation[]) => this.reservations = res,
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
}
