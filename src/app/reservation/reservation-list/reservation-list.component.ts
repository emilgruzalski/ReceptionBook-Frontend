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
        this.errorMessage = err.message;
      }
    })
  }

  public getReservationDetails = (id) => {
    const detailsUrl: string = `reservation/details/${id}`;
    this.router.navigate([detailsUrl])
  }
}
