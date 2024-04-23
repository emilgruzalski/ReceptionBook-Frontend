import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Raport } from 'src/app/_interfaces/raport.model';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { ReservationRepositoryService } from 'src/app/shared/services/reservation-repository.service';

@Component({
  selector: 'app-raport-list',
  templateUrl: './raport-list.component.html',
  styleUrls: ['./raport-list.component.css']
})
export class RaportListComponent implements OnInit {
  raports: Raport[];
  errorMessage: string = '';

  constructor(private repository: ReservationRepositoryService, private errorHandler: ErrorHandlerService, private router: Router) { }

  ngOnInit(): void {
    this.getAllRaports();
  }

  private getAllRaports = () => {
    const apiAddress: string = 'api/reservations/raports';
    this.repository.getRaports(apiAddress)
    .subscribe({
      next: (res: Raport[]) => this.raports = res,
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

}
