import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { CookieService } from 'ngx-cookie-service';

@Injectable() export class ListService {

    public url: string;

    constructor(
        private _http: HttpClient,
        private cookie: CookieService
    ) {
        this.url = Global.url;
    }

    getToken() {
        //return this.cookie.get('token');
        return sessionStorage.getItem('tokenSession');
    }

    saveList(userid: any, params: any):Observable<any>{
        const token = this.getToken();

        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.post(this.url + "save-list/" + userid, params, { headers: headers });  
        } else {
            return this._http.get(this.url + 'error');
        }
    }

    getList(userid: string): Observable<any> {
        const token = this.getToken();
        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.get(this.url + "get-list/" + userid, { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }

    }
}