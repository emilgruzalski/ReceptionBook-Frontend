import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';
import { User } from './../../_interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  public getUsers = (route: string) => {
    return this.http.get<User[]>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  public getUser = (route: string) => {
    return this.http.get<User>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  public deleteUser = (route: string) => {
    return this.http.delete(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  public updateUser = (route: string, user: User) => {
    return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), user, this.generateHeaders());
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
