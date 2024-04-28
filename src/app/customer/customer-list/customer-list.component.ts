import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  paginationInfo: any;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private repository: CustomerRepositoryService, private errorHandler: ErrorHandlerService, public router: Router) { }

  ngOnInit(): void {
    this.getAllCustomers();
  }

  private getAllCustomers = () => {
    const apiAddress: string = `api/customers?PageNumber=${this.currentPage}&PageSize=${this.pageSize}`;
    this.repository.getCustomers(apiAddress)
    .subscribe({
      next: (res) =>
        {
           this.customers = res.body;
            this.paginationInfo = JSON.parse(res.headers.get('x-pagination'));
        },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

  public getCustomerDetails = (id) => {
    const detailsUrl: string = `customer/details/${id}`;
    this.router.navigate([detailsUrl])
  }

  public redirectToDeletePage = (id) => {
    const deleteUrl: string = `/customer/delete/${id}`;
    this.router.navigate([deleteUrl]);
  }

  public redirectToUpdatePage = (id) => {
    const updateUrl: string = `/customer/update/${id}`;
    this.router.navigate([updateUrl]);
  }

  public changePage(newPage: number): void {
    this.currentPage = newPage;
    this.getAllCustomers();
  }

  public nextPage(): void {
    if (this.paginationInfo.HasNext) {
      this.currentPage++;
      this.getAllCustomers();
    }
  }

  public previousPage(): void {
    if (this.paginationInfo.HasPrevious) {
      this.currentPage--;
      this.getAllCustomers();
    }
  }

}
