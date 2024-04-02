import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';
import { Reservation } from './../../_interfaces/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationRepositoryService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  public getReservations = (route: string) => {
    return this.http.get<Reservation[]>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  public getReservation = (route: string) => {
    return this.http.get<Reservation>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  public createReservation = (route: string, reservation: Reservation) => {
    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), reservation, this.generateHeaders());
  }

  public updateReservation = (route: string, reservation: Reservation) => {
    return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), reservation, this.generateHeaders());
  }

  public deleteReservation = (route: string) => {
    return this.http.delete(this.createCompleteRoute(route, this.envUrl.urlAddress));
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
