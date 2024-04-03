import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomerCreateComponent } from './customer-create/customer-create.component';

const routes: Routes = [
  { path: 'list', component: CustomerListComponent },
  { path: 'details/:id', component: CustomerDetailsComponent },
  { path: 'create', component: CustomerCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
