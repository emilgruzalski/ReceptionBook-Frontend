import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';
import { Customer } from './../../_interfaces/customer.model';
import { CustomerForCreation } from 'src/app/_interfaces/customerForCreation.model';
import { CustomerForUpdate } from 'src/app/_interfaces/customerForUpdate.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerRepositoryService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  public getCustomers = (route: string) => {
    const httpOptions = { headers: new HttpHeaders({'x-pagination': 'application/json'}),
    observe: 'response' as 'response'};
    return this.http.get<Customer[]>(this.createCompleteRoute(route, this.envUrl.urlAddress), httpOptions);
  }

  public getCustomer = (route: string) => {
    return this.http.get<Customer>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  public createCustomer = (route: string, customer: CustomerForCreation) => {
    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), customer, this.generateHeaders());
  }

  public updateCustomer = (route: string, customer: CustomerForUpdate) => {
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
