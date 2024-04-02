import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomRoutingModule } from './room-routing.module';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomDetailsComponent } from './room-details/room-details.component';


@NgModule({
  declarations: [
    RoomListComponent,
    RoomDetailsComponent
  ],
  imports: [
    CommonModule,
    RoomRoutingModule
  ]
})
export class RoomModule { }
