import { SuccessModalComponent } from './../../shared/modals/success-modal/success-modal.component';
import { Router } from '@angular/router';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Room } from 'src/app/_interfaces/room.model';
import { HttpErrorResponse } from '@angular/common/http';
import { RoomForCreation } from 'src/app/_interfaces/roomForCreation.model';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RoomRepositoryService } from 'src/app/shared/services/room-repository.service';

@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: ['./room-create.component.css']
})
export class RoomCreateComponent implements OnInit {
  errorMessage: string = '';
  roomForm: FormGroup;
  bsModalRef?: BsModalRef;

  constructor(private repository: RoomRepositoryService, private errorHandler: ErrorHandlerService,
    private router: Router, private modal: BsModalService) { }

  ngOnInit(): void {
    this.roomForm = new FormGroup({
      number: new FormControl(null, [Validators.required, Validators.maxLength(5)]),
      type: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      price: new FormControl(null, [Validators.required, Validators.min(1)])
    });
  }

  validateControl = (controlName: string) => {
    if (this.roomForm.get(controlName).invalid && this.roomForm.get(controlName).touched)
      return true;
    
    return false;
  } 

  hasError = (controlName: string, errorName: string) => {
    if (this.roomForm.get(controlName).hasError(errorName))
      return true;
    
    return false;
  }

  createRoom = (roomFormValue) => {
    if (this.roomForm.valid)
      this.executeRoomCreation(roomFormValue);
  }

  private executeRoomCreation = (roomFormValue) => {
    const room: RoomForCreation = {
      number: roomFormValue.number,
      type: roomFormValue.type,
      price: roomFormValue.price
    }
    const apiUrl = 'api/rooms';
    this.repository.createRoom(apiUrl, room)
    .subscribe({
      next: (res: Room) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Success Message',
            modalBodyText: `Room: ${res.number} created successfully`,
            okButtonText: 'OK'
          }
        };

        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToRoomList());
      },
      error: (err: HttpErrorResponse) => {
          this.errorHandler.handleError(err);
          this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

  redirectToRoomList = () => {
    this.router.navigate(['/room/list']);
  }

}
