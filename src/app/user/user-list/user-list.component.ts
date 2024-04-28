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
  paginationInfo: any;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private repository: UserRepositoryService, private errorHandler: ErrorHandlerService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  private getAllUsers = () => {
    const apiAddress: string = `api/users?PageNumber=${this.currentPage}&PageSize=${this.pageSize}`;
    this.repository.getUsers(apiAddress)
    .subscribe({
      next: (res) => 
        {
          this.users = res.body;
          this.paginationInfo = JSON.parse(res.headers.get('x-pagination'));
      },
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

  public redirectToDeletePage = (id) => { 
    const deleteUrl: string = `/user/delete/${id}`; 
    this.router.navigate([deleteUrl]); 
  }

  public redirectToUpdatePage = (id) => {
    const updateUrl: string = `/user/update/${id}`;
    this.router.navigate([updateUrl]);
  }

  public changePage(newPage: number): void {
    this.currentPage = newPage;
    this.getAllUsers();
  }

  public nextPage(): void {
    if (this.paginationInfo.HasNext) {
      this.currentPage++;
      this.getAllUsers();
    }
  }

  public previousPage(): void {
    if (this.paginationInfo.HasPrevious) {
      this.currentPage--;
      this.getAllUsers();
    }
  }
}
