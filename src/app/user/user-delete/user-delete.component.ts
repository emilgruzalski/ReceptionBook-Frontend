import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { UserRepositoryService } from './../../shared/services/user-repository.service';
import { User } from './../../_interfaces/user.model';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css']
})
export class UserDeleteComponent implements OnInit {
  user: User;
  bsModalRef?: BsModalRef;

  constructor(private repository: UserRepositoryService, private errorHandler: ErrorHandlerService,
    private router: Router, private activeRoute: ActivatedRoute, private modal: BsModalService) { }

  ngOnInit(): void {
    this.getUserById();
  }

  private getUserById = () => {
    const userId: string = this.activeRoute.snapshot.params['id'];
    const userByIdUrl: string = `api/users/${userId}`;

    this.repository.getUser(userByIdUrl)
    .subscribe({
      next: (res: User) => this.user = res,
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
      }
    })
  }

  redirectToUserList = () => {
    this.router.navigate(['/user/list']);
  }

  deleteUser = () => {
    const deleteUrl: string = `api/users/${this.user.id}`;

    this.repository.deleteUser(deleteUrl)
    .subscribe({
      next: (_) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Success Message',
            modalBodyText: 'User successfully deleted',
            okButtonText: 'OK'
          }
        };

        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToUserList());
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
      }
    })
  }

}
