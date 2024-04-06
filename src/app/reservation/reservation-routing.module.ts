import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationDetailsComponent } from './reservation-details/reservation-details.component';
import { ReservationCreateComponent } from './reservation-create/reservation-create.component';
import { ReservationUpdateComponent } from './reservation-update/reservation-update.component';
import { ReservationDeleteComponent } from './reservation-delete/reservation-delete.component';

const routes: Routes = [
  { path: 'list', component: ReservationListComponent },
  { path: 'details/:id', component: ReservationDetailsComponent },
  { path: 'create', component: ReservationCreateComponent },
  { path: 'update/:id', component: ReservationUpdateComponent },
  { path: 'delete/:id', component: ReservationDeleteComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationRoutingModule { }
