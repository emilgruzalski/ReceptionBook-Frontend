import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { ReservationRepositoryService } from './../../shared/services/reservation-repository.service';
import { Reservation } from './../../_interfaces/reservation.model';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';

@Component({
  selector: 'app-reservation-delete',
  templateUrl: './reservation-delete.component.html',
  styleUrls: ['./reservation-delete.component.css']
})
export class ReservationDeleteComponent implements OnInit {
  reservation: Reservation;
  bsModalRef?: BsModalRef;

  constructor(private repository: ReservationRepositoryService, private errorHandler: ErrorHandlerService,
    private router: Router, private activeRoute: ActivatedRoute, private modal: BsModalService) { }

  ngOnInit(): void {
    this.getReservationById();
  }

  private getReservationById = () => {
    const reservationId: string = this.activeRoute.snapshot.params['id'];
    const reservationByIdUrl: string = `api/reservations/${reservationId}`;

    this.repository.getReservation(reservationByIdUrl)
    .subscribe({
      next: (res: Reservation) => this.reservation = res,
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
      }
    })
  }

  redirectToReservationList = () => {
    this.router.navigate(['/reservation/list']);
  }

  deleteReservation = () => {
    const deleteUrl: string = `api/reservations/${this.reservation.id}`;

    this.repository.deleteReservation(deleteUrl)
    .subscribe({
      next: (_) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Success Message',
            modalBodyText: 'Reservation successfully deleted',
            okButtonText: 'OK'
          }
        };

        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToReservationList());
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
      }
    })
  }

}
