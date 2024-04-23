import { Component, OnInit } from '@angular/core';
import { SuccessModalComponent } from './../../shared/modals/success-modal/success-modal.component';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { ReservationRepositoryService } from './../../shared/services/reservation-repository.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Reservation } from 'src/app/_interfaces/reservation.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ReservationForCreation } from 'src/app/_interfaces/reservationForCreation.model';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { error } from 'console';
import { Room } from 'src/app/_interfaces/room.model';
import { Customer } from 'src/app/_interfaces/customer.model';

@Component({
  selector: 'app-reservation-create',
  templateUrl: './reservation-create.component.html',
  styleUrls: ['./reservation-create.component.css']
})
export class ReservationCreateComponent implements OnInit {
  errorMessage: string = '';
  reservationForm: FormGroup;
  bsModalRef: BsModalRef;
  rooms: Room[] = [];
  customers: Customer[] = [];

  constructor(private repository: ReservationRepositoryService, private errorHandler: ErrorHandlerService,
    private router: Router, private datePipe: DatePipe, private modal: BsModalService) { }

  ngOnInit(): void {
    this.reservationForm = new FormGroup({
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      roomId: new FormControl('', [Validators.required]),
      customerId: new FormControl('', [Validators.required]),
      totalPrice: new FormControl('', [Validators.required, Validators.min(1)])
    });

    this.loadCustomer();

    this.reservationForm.get('startDate').valueChanges.subscribe(() => {
      this.loadAvailable();
      this.loadPrice();
    });

    this.reservationForm.get('endDate').valueChanges.subscribe(() => {
      this.loadAvailable();
      this.loadPrice();
    });

    this.reservationForm.get('roomId').valueChanges.subscribe(() => {
      this.loadPrice();
    });
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

  createReservation = (reservationFormValue) => {
    if (this.reservationForm.valid) {
      this.executeReservationCreation(reservationFormValue);
    }
  }

  private executeReservationCreation = (reservationFormValue) => {
    const reservation: ReservationForCreation = {
      startDate: this.datePipe.transform(reservationFormValue.startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(reservationFormValue.endDate, 'yyyy-MM-dd'),
      roomId: reservationFormValue.roomId,
      customerId: reservationFormValue.customerId,
      totalPrice: reservationFormValue.totalPrice,
      status: "Confirmed"
    };

    const apiUrl = 'api/reservations';
    this.repository.createReservation(apiUrl, reservation)
      .subscribe({
        next: (res: Reservation) => {
          const config: ModalOptions = {
            initialState: {
              modalHeaderText: 'Success',
              modalBodyText: 'Reservation was created successfully.',
              okButtonText: 'OK'
            }
          };
          this.bsModalRef = this.modal.show(SuccessModalComponent, config);
          this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToReservationList());
        },
        error: (error: HttpErrorResponse) => {
          this.errorHandler.handleError(error);
          this.errorMessage = this.errorHandler.errorMessage;
        }
      })
  }

  redirectToReservationList = () => {
    this.router.navigate(['/reservation/list']);
  }

  public loadAvailable() {
    const startDate = this.reservationForm.get('startDate').value;
    const endDate = this.reservationForm.get('endDate').value;
    if (startDate && endDate) {
      const apiUrl = `api/rooms/available?StartDate=${this.datePipe.transform(startDate, 'yyyy-MM-dd')}&EndDate=${this.datePipe.transform(endDate, 'yyyy-MM-dd')}`;
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

  public loadPrice() {
    const startDate = this.reservationForm.get('startDate').value;
    const endDate = this.reservationForm.get('endDate').value;
    const roomPrice = this.rooms.find(x => x.id === this.reservationForm.get('roomId').value).price;
    const totalPrice = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) * roomPrice;
    this.reservationForm.get('totalPrice').setValue(totalPrice);
  }
}
