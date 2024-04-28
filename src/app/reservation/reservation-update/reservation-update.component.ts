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
  statuses: ['Confirmed', 'Cancelled', 'CheckedIn', 'CheckedOut'];
  types = ['Single', 'Double', 'President Suite', 'Double with Children', 'Family'];
  initialLoadComplete: boolean = false;


  constructor(private repository: ReservationRepositoryService, private errorHandler: ErrorHandlerService,
    private router: Router, private activeRoute: ActivatedRoute, private datePipe: DatePipe,
    private modal: BsModalService) { }

  ngOnInit(): void {
    this.reservationForm = new FormGroup({
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      roomType: new FormControl('', [Validators.required]),
      roomId: new FormControl('', [Validators.required]),
      customerName: new FormControl(''),
      customerId: new FormControl('', [Validators.required]),
      totalPrice: new FormControl('', [Validators.required, Validators.min(1)]),
      status: new FormControl('', [Validators.required])
    });
    this.loadStatuses();

    this.getReservationById();

    this.loadAvailable();
    
    this.initClean();

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

    this.reservationForm.get('roomType').valueChanges.subscribe(() => {
      this.loadTypes();
    });

    this.reservationForm.get('customerName').valueChanges.subscribe(() => {
      this.loadCustomer();
    });
  }

  private initClean = () => {
    var initRoomType = this.reservation;
    console.log(initRoomType);
  }
  private loadStatuses = () => {
    this.statuses = ['Confirmed', 'Cancelled', 'CheckedIn', 'CheckedOut'];
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
        this.reservationForm.patchValue({ ...this.reservation, customerId: res.customer.id, customerName: this.reservation.customer.lastName, roomType: this.reservation.room.type, roomId: this.reservation.room.id });
        this.initialLoadComplete = true;
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
      totalPrice: reservationFormValue.totalPrice,
      status: reservationFormValue.status
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
      const apiUrl = `api/rooms/available/${id}?StartDate=${this.datePipe.transform(startDate, 'yyyy-MM-dd')}&EndDate=${this.datePipe.transform(endDate, 'yyyy-MM-dd')}&Type=${this.reservationForm.get('roomType').value}`;
      this.repository.getAvailableRooms(apiUrl).subscribe(data => {
        this.rooms = data;
      }, error => {
        console.error('Błąd podczas ładowania dostępnych opcji', error);
      });
    }
  }

  public loadCustomer() {
    let apiUrl = 'api/customers';
  
    // Check if the customerName field has a value and adjust apiUrl accordingly
    const customerName = this.reservationForm.get('customerName').value;
    if (customerName !== '') {
      apiUrl += `?SearchTerm=${encodeURIComponent(customerName)}`; // Use encodeURIComponent for safe URL formatting
    }
  
    // Retrieve customers using the constructed apiUrl
    this.repository.getCustomers(apiUrl).subscribe(data => {
      this.customers = data;
      this.reservationForm.get('customerId').setValue(this.customers[0].id);
    }, error => {
      console.error('Error while loading customers', error);
    });
  }

  redirectToReservationList = () => {
    this.router.navigate(['/reservation/list']);
  }

  public loadPrice() {
    const startDate = this.reservationForm.get('startDate').value;
    const endDate = this.reservationForm.get('endDate').value;
    const roomPrice = this.rooms.find(x => x.id === this.reservationForm.get('roomId').value).price;
    const totalPrice = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) * roomPrice;
    this.reservationForm.get('totalPrice').setValue(totalPrice);
  }

  public loadTypes() {
    if (!this.initialLoadComplete) return;

    const startDate = this.reservationForm.get('startDate').value;
    const endDate = this.reservationForm.get('endDate').value;
    const id: string = this.activeRoute.snapshot.params['id'];
    if (startDate && endDate) {
      const apiUrl = `api/rooms/available/${id}?StartDate=${this.datePipe.transform(startDate, 'yyyy-MM-dd')}&EndDate=${this.datePipe.transform(endDate, 'yyyy-MM-dd')}&Type=${this.reservationForm.get('roomType').value}`;
      this.repository.getAvailableRooms(apiUrl).subscribe(data => {
        this.rooms = data;
        const currentRoomId = this.reservationForm.get('roomId').value;
        if (this.rooms.length > 0) {
          // If the current roomId is not in the list, update it to the first available room
          for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].id === currentRoomId) {
              this.reservationForm.get('roomId').setValue(this.rooms[currentRoomId]);
              break;
            }
            else {
              this.reservationForm.get('roomId').setValue(this.rooms[0].id);
              this.loadPrice(); 
            }
          }
        }
        else {
          this.reservationForm.get('roomId').setValue('');
          this.reservationForm.get('totalPrice').setValue('');
        }
      }, error => {
        console.error('Error while loading available rooms', error);
      });
    }
  }
}
