import { Item } from './../../models/item';
import { BaseService } from 'src/app/Service/base.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';



@Injectable()
export class ItemService extends BaseService {

  constructor(private http: HttpClient){super(); }

  newItem(item: Item): Observable<Item> {
    return this.http
        .post(this.UrlService + 'item', item)
        .pipe(
            map(super.extractData),
            catchError(super.serviceError));
}

getItems(): Observable<Item[]> {
  return this.http
      .get<Item[]>(this.UrlService + 'item')
      .pipe(catchError(super.serviceError));
}

getItemsById(id: Number): Observable<Item> {
  return this.http
  .get<Item>(this.UrlService + 'item' + '/' + id)
  .pipe(catchError(super.serviceError));
}

updateItem(item: Item): Observable<Item> {
  return this.http
  .put(this.UrlService + 'item' + '/' + item.id, item)
  .pipe(
    map(this.extractData),
    catchError(this.serviceError));
}

}
