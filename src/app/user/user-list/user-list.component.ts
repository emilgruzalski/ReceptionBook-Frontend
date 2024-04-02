import { Component, OnInit } from '@angular/core';

import { User } from './../../_interfaces/user.model';
import { UserRepositoryService } from './../../shared/services/user-repository.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[];

  constructor(private repository: UserRepositoryService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  private getAllUsers = () => {
    const apiAddress: string = 'api/users';
    this.repository.getUsers(apiAddress)
    .subscribe(res => {
      this.users = res;
    })
  }
}
