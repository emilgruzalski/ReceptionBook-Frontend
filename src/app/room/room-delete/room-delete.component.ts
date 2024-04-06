import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { RoomRepositoryService } from './../../shared/services/room-repository.service';
import { Room } from './../../_interfaces/room.model';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';

@Component({
  selector: 'app-room-delete',
  templateUrl: './room-delete.component.html',
  styleUrls: ['./room-delete.component.css']
})
export class RoomDeleteComponent implements OnInit {
  room: Room;
  bsModalRef?: BsModalRef;

  constructor(private repository: RoomRepositoryService, private errorHandler: ErrorHandlerService,
    private router: Router, private activeRoute: ActivatedRoute, private modal: BsModalService) { }

  ngOnInit(): void {
    this.getRoomById();
  }

  private getRoomById = () => {
    const roomId: string = this.activeRoute.snapshot.params['id'];
    const roomByIdUrl: string = `api/rooms/${roomId}`;

    this.repository.getRoom(roomByIdUrl)
    .subscribe({
      next: (res: Room) => this.room = res,
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
      }
    })
  }

  redirectToRoomList = () => {
    this.router.navigate(['/room/list']);
  }

  deleteRoom = () => {
    const deleteUrl: string = `api/rooms/${this.room.id}`;

    this.repository.deleteRoom(deleteUrl)
    .subscribe({
      next: (_) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Success Message',
            modalBodyText: 'Room successfully deleted',
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

}
