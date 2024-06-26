import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomRoutingModule } from './room-routing.module';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { RoomCreateComponent } from './room-create/room-create.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RoomUpdateComponent } from './room-update/room-update.component';
import { RoomDeleteComponent } from './room-delete/room-delete.component';

@NgModule({
  declarations: [
    RoomListComponent,
    RoomDetailsComponent,
    RoomCreateComponent,
    RoomUpdateComponent,
    RoomDeleteComponent
  ],
  imports: [
    CommonModule,
    RoomRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class RoomModule { }
