import { Component, OnInit } from '@angular/core';

import { Reservation } from './../../_interfaces/reservation.model';
import { ReservationRepositoryService } from './../../shared/services/reservation-repository.service';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[];

  constructor(private repository: ReservationRepositoryService) { }

  ngOnInit(): void {
    this.getAllReservations();
  }

  private getAllReservations = () => {
    const apiAddress: string = 'api/reservations';
    this.repository.getReservations(apiAddress)
    .subscribe(res => {
      this.reservations = res;
    })
  }
}
