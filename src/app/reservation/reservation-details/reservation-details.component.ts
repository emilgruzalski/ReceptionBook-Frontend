import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Reservation } from './../../_interfaces/reservation.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ReservationRepositoryService } from './../../shared/services/reservation-repository.service';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css']
})
export class ReservationDetailsComponent implements OnInit {
  reservation: Reservation;
  errorMessage: string = '';

  constructor(private repository: ReservationRepositoryService, private router: Router, 
              private activeRoute: ActivatedRoute, private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.getReservationDetails();
  }

  getReservationDetails = () => {
    const id: string = this.activeRoute.snapshot.params['id'];
    const apiUrl: string = `api/reservations/${id}`;

    this.repository.getReservation(apiUrl)
    .subscribe({
      next: (res: Reservation) => this.reservation = res,
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
      }
    })
  }

}
