import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserListComponent } from './user-list/user-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';

const routes: Routes = [
  { path: 'list', component: UserListComponent },
  { path: 'details/:id', component: UserDetailsComponent },
  { path: 'update/:id', component: UserUpdateComponent },
  { path: 'delete/:id', component: UserDeleteComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
