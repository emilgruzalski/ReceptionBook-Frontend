import { Component, OnInit } from '@angular/core';
import { SuccessModalComponent } from './../../shared/modals/success-modal/success-modal.component';
import { Router } from '@angular/router';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { CustomerRepositoryService } from './../../shared/services/customer-repository.service';
import { Customer } from './../../_interfaces/customer.model';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerForCreation } from 'src/app/_interfaces/customerForCreation.model';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css']
})
export class CustomerCreateComponent implements OnInit {
  errorMessage: string = '';
  customerForm: FormGroup;
  bsModalRef?: BsModalRef;

  constructor(private repository: CustomerRepositoryService, private errorHandler: ErrorHandlerService,
    private router: Router, private modal: BsModalService) { }

  ngOnInit(): void {
    this.customerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(40), Validators.email]),
      phoneNumber: new FormControl('', [Validators.maxLength(9), Validators.pattern('^[0-9]*$'), Validators.minLength(9)])
    });
  }

  validateControl = (controlName: string) => {
    if (this.customerForm.get(controlName).invalid && this.customerForm.get(controlName).touched)
      return true;
    
    return false;
  } 
  hasError = (controlName: string, errorName: string) => {
    if (this.customerForm.get(controlName).hasError(errorName))
      return true;
    
    return false;
  }

  createCustomer = (customerFormValue: any) => {
    if (this.customerForm.valid) {
      this.executeCustomerCreation(customerFormValue);
    }
  }

  private executeCustomerCreation = (customerFormValue: any) => {
    const customer: CustomerForCreation = {
      firstName: customerFormValue.firstName,
      lastName: customerFormValue.lastName,
      email: customerFormValue.email,
      phoneNumber: customerFormValue.phoneNumber === '' ? null : customerFormValue.phoneNumber
    }

    const apiUrl = 'api/customers';
    this.repository.createCustomer(apiUrl, customer)
      .subscribe({
        next: (res: Customer) => {
          const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Success Message',
            modalBodyText: `Customer: ${res.email} created successfully`,
            okButtonText: 'OK'
          }
        };
        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToCustomerList());
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

  redirectToCustomerList = () => {
    this.router.navigate(['/customer/list']);
  }

}
