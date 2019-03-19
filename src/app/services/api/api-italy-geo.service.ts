import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GetBaseUrl } from 'app/helper/getBaseUrl';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiItalyGeoService {


  private baseUrl = GetBaseUrl.baseUrl();

  constructor(
    private http: HttpClient,
  ) { }

  public apiGetAllProvince(): Observable<any> {
    return this.http.get(this.baseUrl + '/italyGeo/province').pipe (
            map(data => data || 0)
        );
  }


}
