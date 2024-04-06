import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { CustomerRepositoryService } from './../../shared/services/customer-repository.service';
import { Customer } from './../../_interfaces/customer.model';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';

@Component({
  selector: 'app-customer-delete',
  templateUrl: './customer-delete.component.html',
  styleUrls: ['./customer-delete.component.css']
})
export class CustomerDeleteComponent implements OnInit {
  customer: Customer;
  bsModalRef?: BsModalRef;

  constructor(private repository: CustomerRepositoryService, private errorHandler: ErrorHandlerService,
    private router: Router, private activeRoute: ActivatedRoute, private modal: BsModalService) { }

  ngOnInit(): void {
    this.getCustomerById();
  }

  private getCustomerById = () => {
    const customerId: string = this.activeRoute.snapshot.params['id'];
    const customerByIdUrl: string = `api/customers/${customerId}`;

    this.repository.getCustomer(customerByIdUrl)
    .subscribe({
      next: (res: Customer) => this.customer = res,
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
      }
    })
  }

  redirectToCustomerList = () => {
    this.router.navigate(['/customer/list']);
  }

  deleteCustomer = () => {
    const deleteUrl: string = `api/customers/${this.customer.id}`;

    this.repository.deleteCustomer(deleteUrl)
    .subscribe({
      next: (_) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Success Message',
            modalBodyText: 'Customer successfully deleted',
            okButtonText: 'OK'
          }
        };

        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToCustomerList());
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
      }
    })
  }

}
