import { Component, OnInit } from '@angular/core';
import { ReservationForUpdate } from './../../_interfaces/reservationForUpdate.model';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Reservation } from './../../_interfaces/reservation.model';
import { ReservationRepositoryService } from 'src/app/shared/services/reservation-repository.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { Customer } from 'src/app/_interfaces/customer.model';
import { Room } from 'src/app/_interfaces/room.model';

@Component({
  selector: 'app-reservation-update',
  templateUrl: './reservation-update.component.html',
  styleUrls: ['./reservation-update.component.css']
})
export class ReservationUpdateComponent implements OnInit {
  reservationForm: FormGroup;
  reservation: Reservation;
  bsModalRef?: BsModalRef;
  rooms: Room[] = [];
  customers: Customer[] = [];

  constructor(private repository: ReservationRepositoryService, private errorHandler: ErrorHandlerService, 
    private router: Router, private activeRoute: ActivatedRoute, private datePipe: DatePipe,
    private modal: BsModalService) { }

  ngOnInit(): void {
    this.reservationForm = new FormGroup({
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      roomId: new FormControl('', [Validators.required]),
      customerId: new FormControl('', [Validators.required]),
      totalPrice: new FormControl('', [Validators.required, Validators.min(1)])
    });

    this.getReservationById();

    this.loadCustomer();

    this.reservationForm.get('startDate').valueChanges.subscribe(() => {
      this.loadAvailable();
    });

    this.reservationForm.get('endDate').valueChanges.subscribe(() => {
      this.loadAvailable();
    });
  }

  private getReservationById = () => {
    const id: string = this.activeRoute.snapshot.params['id'];
    const reservationByIdUrl: string = `api/reservations/${id}`;

    this.repository.getReservation(reservationByIdUrl)
    .subscribe({
      next: (res: Reservation) => {
        this.reservation = { ...res,
          startDate: new Date(this.datePipe.transform(res.startDate, 'MM/dd/yyyy')),
          endDate: new Date(this.datePipe.transform(res.endDate, 'MM/dd/yyyy')),
          customer: res.customer,
          room: res.room
        }; 
        this.reservationForm.patchValue({ ...this.reservation, customerId: res.customer.id, roomId: res.room.id });
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
      }
    })
  }

  validateControl = (controlName: string) => {
    if (this.reservationForm.get(controlName).invalid && this.reservationForm.get(controlName).touched)
      return true;

    return false;
  }
  hasError = (controlName: string, errorName: string) => {
    if (this.reservationForm.get(controlName).hasError(errorName))
      return true;

    return false;
  }

  public updateReservation = (reservationFormValue) => {
    if (this.reservationForm.valid) {
      this.executeReservationUpdate(reservationFormValue);
    }
  }

  private executeReservationUpdate = (reservationFormValue) => {
    const id: string = this.activeRoute.snapshot.params['id'];
    const reservation: ReservationForUpdate = {
      startDate: this.datePipe.transform(reservationFormValue.startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(reservationFormValue.endDate, 'yyyy-MM-dd'),
      roomId: reservationFormValue.roomId,
      customerId: reservationFormValue.customerId,
      totalPrice: reservationFormValue.totalPrice
    };

    const apiUrl = `api/reservations/${id}`;
    this.repository.updateReservation(apiUrl, reservation)
      .subscribe({
        next: (_) => {
          const config: ModalOptions = {
            initialState: {
              modalHeaderText: 'Success Message',
              modalBodyText: 'Reservation was updated successfully.',
              okButtonText: 'OK'
            }
          };
          this.bsModalRef = this.modal.show(SuccessModalComponent, config);
          this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToReservationList());
        },
        error: (error: HttpErrorResponse) => {
          this.errorHandler.handleError(error);
        }
      });
  }

  public loadAvailable() {
    const startDate = this.reservationForm.get('startDate').value;
    const endDate = this.reservationForm.get('endDate').value;
    const id: string = this.activeRoute.snapshot.params['id'];
    if (startDate && endDate) {
      const apiUrl = `api/rooms/available/${id}?StartDate=${this.datePipe.transform(startDate, 'yyyy-MM-dd')}&EndDate=${this.datePipe.transform(endDate, 'yyyy-MM-dd')}`;
      this.repository.getAvailableRooms(apiUrl).subscribe(data => {
        this.rooms = data; 
      }, error => {
        console.error('Błąd podczas ładowania dostępnych opcji', error);
      });
    }
  }

  public loadCustomer() {
    const apiUrl = 'api/customers';
    this.repository.getCustomers(apiUrl).subscribe(data => {
      this.customers = data; 
    }, error => {
      console.error('Błąd podczas ładowania dostępnych opcji', error);
    });
  }

  redirectToReservationList = () => {
    this.router.navigate(['/reservation/list']);
  }

}
