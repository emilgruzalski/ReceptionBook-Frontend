import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationDetailsComponent } from './reservation-details/reservation-details.component';
import { ReservationCreateComponent } from './reservation-create/reservation-create.component';

const routes: Routes = [
  { path: 'list', component: ReservationListComponent },
  { path: 'details/:id', component: ReservationDetailsComponent },
  { path: 'create', component: ReservationCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationRoutingModule { }
