import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';
import { Reservation } from './../../_interfaces/reservation.model';
import { ReservationForCreation } from 'src/app/_interfaces/reservationForCreation.model';
import { ReservationForUpdate } from 'src/app/_interfaces/reservationForUpdate.model';
import { Room } from 'src/app/_interfaces/room.model';
import { Customer } from 'src/app/_interfaces/customer.model';
import { Raport } from 'src/app/_interfaces/raport.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationRepositoryService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  public getReservations = (route: string) => {
    const httpOptions = { headers: new HttpHeaders({'x-pagination': 'application/json'}),
    observe: 'response' as 'response'};
    return this.http.get<Reservation[]>(this.createCompleteRoute(route, this.envUrl.urlAddress), httpOptions);
  }

  public getReservation = (route: string) => {
    return this.http.get<Reservation>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  public createReservation = (route: string, reservation: ReservationForCreation) => {
    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), reservation, this.generateHeaders());
  }

  public updateReservation = (route: string, reservation: ReservationForUpdate) => {
    return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), reservation, this.generateHeaders());
  }

  public deleteReservation = (route: string) => {
    return this.http.delete(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  public getAvailableRooms = (route: string) => {
    return this.http.get<Room[]>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  public getCustomers = (route: string) => {
    return this.http.get<Customer[]>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  public getRaports = (route: string) => {
    const httpOptions = { headers: new HttpHeaders({'x-pagination': 'application/json'}),
    observe: 'response' as 'response'};
    return this.http.get<Raport[]>(this.createCompleteRoute(route, this.envUrl.urlAddress), httpOptions);
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }

  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
  }
}
