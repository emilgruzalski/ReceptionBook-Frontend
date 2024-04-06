import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoomListComponent } from './room-list/room-list.component';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { RoomCreateComponent } from './room-create/room-create.component';
import { RoomUpdateComponent } from './room-update/room-update.component';
import { RoomDeleteComponent } from './room-delete/room-delete.component';

const routes: Routes = [
  { path: 'list', component: RoomListComponent },
  { path: 'details/:id', component: RoomDetailsComponent},
  { path: 'create', component: RoomCreateComponent},
  { path: 'update/:id', component: RoomUpdateComponent},
  { path: 'delete/:id', component: RoomDeleteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
