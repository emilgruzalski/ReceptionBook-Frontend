import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/_interfaces/user.model';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { UserRepositoryService } from 'src/app/shared/services/user-repository.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: User;
  errorMessage: string = '';

  constructor(private repository: UserRepositoryService, private router: Router, private activeRoute: ActivatedRoute, private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.getUserDetails()
  }

  getUserDetails = () => {
    const id: string = this.activeRoute.snapshot.params['id'];
    const apiUrl: string = `api/users/${id}`;

    this.repository.getUser(apiUrl)
    .subscribe({
      next: (res: User) => this.user = res,
      error: (err) => {
        this.errorMessage = err.message;
      }
    })
  }

}
