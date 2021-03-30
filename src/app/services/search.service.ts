import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';



@Injectable() export class SearchServise {

    public url: string;

    constructor(
        private _http: HttpClient,
    ){
        this.url = Global.url
    }

    search(searchString: string): Observable<any> {
        return this._http.get(this.url + 'searchs/' + searchString);
    }
}