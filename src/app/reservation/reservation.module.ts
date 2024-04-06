import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservationRoutingModule } from './reservation-routing.module';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationDetailsComponent } from './reservation-details/reservation-details.component';
import { ReservationCreateComponent } from './reservation-create/reservation-create.component';
import { SharedModule } from '../shared/shared.module';
import { ReservationUpdateComponent } from './reservation-update/reservation-update.component';
import { ReservationDeleteComponent } from './reservation-delete/reservation-delete.component';


@NgModule({
  declarations: [
    ReservationListComponent,
    ReservationDetailsComponent,
    ReservationCreateComponent,
    ReservationUpdateComponent,
    ReservationDeleteComponent
  ],
  imports: [
    CommonModule,
    ReservationRoutingModule,
    SharedModule
  ]
})
export class ReservationModule { }
