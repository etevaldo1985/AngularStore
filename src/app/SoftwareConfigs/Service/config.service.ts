import { Province } from 'src/app/models/province';
import { City } from './../../models/city';
import { BaseService } from 'src/app/Service/base.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';



@Injectable()
export class ConfigService extends BaseService {

  constructor(private http: HttpClient){super(); }

  newCity(city: City): Observable<City> {
    return this.http
        .post(this.UrlService + 'city', city)
        .pipe(
            map(super.extractData),
            catchError(super.serviceError));
}

getCities(): Observable<City[]> {
  return this.http
      .get<City[]>(this.UrlService + 'city')
      .pipe(catchError(super.serviceError));
}
getCityById(id: number): Observable<City> {
  return this.http
      .get<City>(this.UrlService + 'city' + '/' + id)
      .pipe(catchError(super.serviceError));
}

updateCity(city: City): Observable<City> {
  return this.http
  .put(this.UrlService + 'city' + '/' + city.id, city)
  .pipe(
    map(this.extractData),
    catchError(this.serviceError));
}

getProvinceById(id: number): Observable<Province> {
  return this.http
      .get<Province>(this.UrlService + 'province' + '/' + id)
      .pipe(catchError(super.serviceError));
}

getProvincies(): Observable<Province[]> {
  return this.http
      .get<Province[]>(this.UrlService + 'province')
      .pipe(catchError(super.serviceError));
}

newProvince(province: Province): Observable<Province> {
  return this.http
      .post(this.UrlService + 'province', province)
      .pipe(
          map(super.extractData),
          catchError(super.serviceError));
}

updateProvince(province: Province): Observable<Province> {
  return this.http
  .put(this.UrlService + 'province' + '/' + province.id, province)
  .pipe(
    map(this.extractData),
    catchError(this.serviceError));
}


}
