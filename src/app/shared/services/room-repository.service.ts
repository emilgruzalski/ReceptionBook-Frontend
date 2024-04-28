import { Injectable } from '@angular/core';
import { Room } from './../../_interfaces/room.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';
import { RoomForCreation } from 'src/app/_interfaces/roomForCreation.model';
import { RoomForUpdate } from 'src/app/_interfaces/roomForUpdate.model';

@Injectable({
  providedIn: 'root'
})
export class RoomRepositoryService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  public getRooms = (route: string) => {
    const httpOptions = { headers: new HttpHeaders({'x-pagination': 'application/json'}),
    observe: 'response' as 'response'};
    return this.http.get<Room[]>(this.createCompleteRoute(route, this.envUrl.urlAddress), httpOptions);
  }

  public getRoom = (route: string) => {
    return this.http.get<Room>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  public createRoom = (route: string, room: RoomForCreation) => {
    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), room, this.generateHeaders());
  }

  public updateRoom = (route: string, room: RoomForUpdate) => {
    return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), room, this.generateHeaders());
  }

  public deleteRoom = (route: string) => {
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
