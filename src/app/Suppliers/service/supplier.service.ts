import { BaseService } from 'src/app/Service/base.service';


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Supplier } from 'src/app/models/supplier';



@Injectable()
export class SupplierService extends BaseService {

  constructor(private http: HttpClient){super(); }

  newSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http
        .post(this.UrlService + 'supplier', supplier)
        .pipe(
            map(super.extractData),
            catchError(super.serviceError));
}

getSuppliers(): Observable<Supplier[]> {
  return this.http
      .get<Supplier[]>(this.UrlService + 'supplier')
      .pipe(catchError(super.serviceError));
}

getSupplierById(id: Number): Observable<Supplier> {
  return this.http
  .get<Supplier>(this.UrlService + 'supplier' + '/' + id)
  .pipe(catchError(super.serviceError));

}

updateSupplier(supplier: Supplier): Observable<Supplier> {
  return this.http
  .put(this.UrlService + 'supplier' + '/' + supplier.id, supplier)
  .pipe(
    map(this.extractData),
    catchError(this.serviceError));
}

}
