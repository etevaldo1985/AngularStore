import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Customer } from './../../models/customer';
import { BaseService } from 'src/app/Service/base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable ()

export class CustomerService extends BaseService {

constructor(private http: HttpClient) {super(); }


newCustomer(customer: Customer): Observable<Customer> {

  return this.http
    .post(this.UrlService + 'customer', customer)
    .pipe(
      map(super.extractData),
      catchError(super.serviceError));
}

getCustomers(): Observable<Customer[]> {
  return this.http
    .get<Customer[]>(this.UrlService + 'customer')
    .pipe(catchError(super.serviceError));
}

getCustomerById(id: Number): Observable<Customer> {
  return this.http
  .get<Customer>(this.UrlService + 'customer' + '/' + id)
  .pipe(catchError(super.serviceError));
}

updateCustomer(customer: Customer): Observable<Customer> {
  return this.http
  .put(this.UrlService + 'customer' + '/' + customer.id, customer)
  .pipe(
    map(this.extractData),
    catchError(this.serviceError));
}
}
