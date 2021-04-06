import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { CookieService } from 'ngx-cookie-service';

@Injectable() export class NotifyService {

    public url: string;
    public notifyCount: number = 0;
    public userId: string = null;

    constructor(
        private _http: HttpClient,
        private cookie: CookieService
    ) {
        this.url = Global.url;
    }

    getToken() {
        return this.cookie.get('x-token');
    }

    getNotifys(userid: any): Observable<any> {
        const token = this.getToken();
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-token': token });
        return this._http.get(this.url + "notifys/" + userid, { headers });
    }

    updateAlert(notifyid: any, update: any): Observable<any> {
        const token = this.getToken();
        let params = JSON.stringify(update);
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-token': token });
        return this._http.patch(this.url + 'notifys/' + notifyid, params, { headers: headers });

    }

}