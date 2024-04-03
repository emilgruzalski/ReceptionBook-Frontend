import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomRoutingModule } from './room-routing.module';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { RoomCreateComponent } from './room-create/room-create.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    RoomListComponent,
    RoomDetailsComponent,
    RoomCreateComponent
  ],
  imports: [
    CommonModule,
    RoomRoutingModule,
    SharedModule
  ]
})
export class RoomModule { }
