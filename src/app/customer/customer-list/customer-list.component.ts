import { Component, OnInit } from '@angular/core';

import { Customer } from './../../_interfaces/customer.model';
import { CustomerRepositoryService } from './../../shared/services/customer-repository.service';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: Customer[];
  errorMessage: string = '';

  constructor(private repository: CustomerRepositoryService, private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.getAllCustomers();
  }

  private getAllCustomers = () => {
    const apiAddress: string = 'api/customers';
    this.repository.getCustomers(apiAddress)
    .subscribe({
      next: (res: Customer[]) => this.customers = res,
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

}
