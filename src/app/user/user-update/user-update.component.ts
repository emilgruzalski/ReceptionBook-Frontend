import { Component, OnInit } from '@angular/core';
import { UserForUpdate } from './../../_interfaces/userForUpdate.model';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from './../../_interfaces/user.model';
import { UserRepositoryService } from 'src/app/shared/services/user-repository.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { ok } from 'assert';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  userForm: FormGroup;
  user: User;
  bsModalRef?: BsModalRef;
  roles: string[] = [];

  constructor(private repository: UserRepositoryService, private errorHandler: ErrorHandlerService, 
    private router: Router, private activeRoute: ActivatedRoute,
    private modal: BsModalService) { }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40)]),
      roleName: new FormControl('', [Validators.required])
    });
  
    this.getUserById();

    this.loadRoles();
  }

  loadRoles = () => {
    this.roles = ['Administrator', 'Manager', 'None'];
  }
  
  private getUserById = () => {
    const id: string = this.activeRoute.snapshot.params['id'];
    const userByIdUrl: string = `api/users/${id}`;
  
    this.repository.getUser(userByIdUrl)
    .subscribe(res => {
      this.user = res as User;
      this.userForm.patchValue({ 
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        roleName: this.user.roles.length > 0 ? this.user.roles[0] : 'None'
      });
    },
    (error: HttpErrorResponse) => {
      this.errorHandler.handleError(error);
    });
  }

  validateControl = (controlName: string) => {
    if (this.userForm.get(controlName).invalid && this.userForm.get(controlName).touched)
      return true;
    
    return false;
  } 
  hasError = (controlName: string, errorName: string) => {
    if (this.userForm.get(controlName).hasError(errorName))
      return true;
    
    return false;
  }

  public updateUser = (userFormValue) => {
    if (this.userForm.valid) {
      this.executeUserUpdate(userFormValue);
    }
  }

  private executeUserUpdate = (userFormValue) => {
    const user: UserForUpdate = {
      firstName: userFormValue.firstName,
      lastName: userFormValue.lastName,
      email: userFormValue.email,
      roles: userFormValue.roleName === 'None' ? null : [ userFormValue.roleName ]
    }

    const apiUrl: string = `api/users/${this.user.id}`;

    this.repository.updateUser(apiUrl, user)
    .subscribe({
      next: (_) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Success Message',
            modalBodyText: 'User updated successfully.',
            okButtonText: 'OK' 
          }
        };
        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToUserList());
    },
    error: (error: HttpErrorResponse) => {
      this.errorHandler.handleError(error);
    }
    })
  }

  redirectToUserList = () => {
    this.router.navigate(['/user/list']);
  }

}
