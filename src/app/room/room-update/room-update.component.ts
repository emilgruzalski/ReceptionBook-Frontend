import { Component, OnInit } from '@angular/core';
import { RoomForUpdate } from 'src/app/_interfaces/roomForUpdate.model';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Room } from './../../_interfaces/room.model';
import { RoomRepositoryService } from './../../shared/services/room-repository.service';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';

@Component({
  selector: 'app-room-update',
  templateUrl: './room-update.component.html',
  styleUrls: ['./room-update.component.css']
})
export class RoomUpdateComponent implements OnInit {
  room: Room;
  roomForm: FormGroup;
  bsModalRef?:BsModalRef;

  constructor(private repository: RoomRepositoryService, private errorHandler: ErrorHandlerService, 
    private router: Router, private activeRoute: ActivatedRoute, private modal: BsModalService) { }

  ngOnInit(): void {
    this.roomForm = new FormGroup({
      number: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      type: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      price: new FormControl('', [Validators.required, Validators.min(1)])
    });

    this.getRoomById();
  }

  private getRoomById = () => {
    const roomId: string = this.activeRoute.snapshot.params['id'];
    const roomByIdUrl: string = `api/rooms/${roomId}`;

    this.repository.getRoom(roomByIdUrl)
    .subscribe({
      next: (res: Room) => {
        this.room = res;
        this.roomForm.patchValue(this.room);
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
      }
    })
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

  public updateRoom = (roomFormValue) => {
    if (this.roomForm.valid) {
      this.executeRoomUpdate(roomFormValue);
    }
  }

  private executeRoomUpdate = (roomFormValue) => {
    const roomForUpd: RoomForUpdate = {
      number: roomFormValue.number,
      type: roomFormValue.type,
      price: roomFormValue.price
    }

    const apiUrl = `api/rooms/${this.room.id}`;

    this.repository.updateRoom(apiUrl, roomForUpd)
    .subscribe({
      next: (_) => {
        const config: ModalOptions = {
          initialState: {
            title: 'Success Message',
            modalBodyText: 'Room updated successfully',
            okButtonText: 'OK'
          }
        };

        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToRoomList());
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
      }
    })
  }

  public redirectToRoomList = () => {
    this.router.navigate(['/room/list']);
  }

}
