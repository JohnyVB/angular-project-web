import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { CookieService } from 'ngx-cookie-service';

@Injectable() export class NotifyService {

    public url: string;
    public alert: boolean;


    constructor(
        private _http: HttpClient,
        private cookie: CookieService
    ) {
        this.url = Global.url;
        this.alert = false;
    }

    getToken() {
        return this.cookie.get('token');
    }

    getNotify(userid: any): Observable<any> {
        return this._http.get(this.url + "get-notify/" + userid);
    }

    saveNotify(notify: any, userid: any): Observable<any> {
        const token = this.getToken();

        if (token) {
            let params = JSON.stringify(notify);
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.post(this.url + "save-notify/" + userid, params, { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }
    }

    sendEmail(emailUser: any, notify: any){
        const token = this.getToken();
        console.log('Servicio');
        
        if (token) {
            let params = JSON.stringify(notify);
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.post(this.url + 'send-email-user/' + emailUser, params, { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }
    }

    updateAlert(notifyid: any, update: any): Observable<any> {
        const token = this.getToken();
        
        if (token) {
            let params = JSON.stringify(update);
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.put(this.url + 'update-alert-notify/' + notifyid, params, { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }
    }
}