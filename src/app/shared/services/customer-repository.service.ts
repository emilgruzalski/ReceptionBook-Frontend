import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';
import { Customer } from './../../_interfaces/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerRepositoryService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  public getCustomers = (route: string) => {
    return this.http.get<Customer[]>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  public getCustomer = (route: string) => {
    return this.http.get<Customer>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  public createCustomer = (route: string, customer: Customer) => {
    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), customer, this.generateHeaders());
  }

  public updateCustomer = (route: string, customer: Customer) => {
    return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), customer, this.generateHeaders());
  }

  public deleteCustomer = (route: string) => {
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
