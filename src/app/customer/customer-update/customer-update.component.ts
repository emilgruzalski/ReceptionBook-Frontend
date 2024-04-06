import { Component, OnInit } from '@angular/core';
import { CustomerForUpdate } from './../../_interfaces/customerForUpdate.model';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Customer } from './../../_interfaces/customer.model';
import { CustomerRepositoryService } from 'src/app/shared/services/customer-repository.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';

@Component({
  selector: 'app-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrls: ['./customer-update.component.css']
})
export class CustomerUpdateComponent implements OnInit {
  customerForm: FormGroup;
  customer: Customer;
  bsModalRef?: BsModalRef;

  constructor(private repository: CustomerRepositoryService, private errorHandler: ErrorHandlerService, 
    private router: Router, private activeRoute: ActivatedRoute,
    private modal: BsModalService) { }

  ngOnInit(): void {
    this.customerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(40), Validators.email]),
      phoneNumber: new FormControl('', [Validators.maxLength(9), Validators.pattern('^[0-9]*$'), Validators.minLength(9)])
    });

    this.getCustomerById();
  }

  private getCustomerById = () => {
    let customerId: string = this.activeRoute.snapshot.params['id'];
    let customerByIdUrl: string = `api/customers/${customerId}`;

    this.repository.getCustomer(customerByIdUrl)
    .subscribe({
      next: (customer: Customer) => {
        this.customer = customer;
        this.customerForm.patchValue(this.customer);
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandler.handleError(error);
      }
    })
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

  public updateCustomer = (customerFormValue: any) => {
    if (this.customerForm.valid) {
      this.executeCustomerUpdate(customerFormValue);
    }
  }

  private executeCustomerUpdate = (customerFormValue: any) => {
    this.customer.firstName = customerFormValue.firstName;
    this.customer.lastName = customerFormValue.lastName;
    this.customer.email = customerFormValue.email;
    this.customer.phoneNumber = customerFormValue.phoneNumber === '' ? null : customerFormValue.phoneNumber;

    let apiUrl = `api/customers/${this.customer.id}`;
    this.repository.updateCustomer(apiUrl, this.customer)
      .subscribe({
        next: () => {
          const config: ModalOptions = {
            initialState: {
              modalHeaderText: 'Success Message',
              modalBodyText: 'Customer updated successfully.',
              okButtonText: 'OK'
            }
          };
          this.bsModalRef = this.modal.show(SuccessModalComponent, config);
          this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToCustomerList());
        },
        error: (error: HttpErrorResponse) => {
          this.errorHandler.handleError(error);
        }
      })
  }

  public redirectToCustomerList = () => {
    this.router.navigate(['/customer/list']);
  }

}
