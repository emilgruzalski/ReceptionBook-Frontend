import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Customer } from './../../_interfaces/customer.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerRepositoryService } from './../../shared/services/customer-repository.service';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  customer: Customer;
  errorMessage: string = '';

  constructor(private repository: CustomerRepositoryService, private router: Router,
              private activeRoute: ActivatedRoute, private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.getCustomerDetails()
  }

  getCustomerDetails = () => {
    const id: string = this.activeRoute.snapshot.params['id'];
    const apiUrl: string = `api/customers/${id}`;

    this.repository.getCustomer(apiUrl)
    .subscribe({
      next: (res: Customer) => this.customer = res,
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

}
