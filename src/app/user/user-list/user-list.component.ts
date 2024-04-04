import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './../../_interfaces/user.model';
import { UserRepositoryService } from './../../shared/services/user-repository.service';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[];
  errorMessage: string = '';

  constructor(private repository: UserRepositoryService, private errorHandler: ErrorHandlerService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  private getAllUsers = () => {
    const apiAddress: string = 'api/users';
    this.repository.getUsers(apiAddress)
    .subscribe({
      next: (res: User[]) => this.users = res,
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

  public getUserDetails = (id) => {
    const detailsUrl: string = `user/details/${id}`;
    this.router.navigate([detailsUrl])
  }
}
