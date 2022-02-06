import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { CookieService } from 'ngx-cookie-service';


@Injectable() export class CommentService {

    public url: string;

    constructor(
        private _http: HttpClient,
        private cookie: CookieService
    ) {
        this.url = Global.url;
    }
    getToken() {
        return this.cookie.get("x-token");
    }

    getComments(articleId: string, order: string, coleccion: string, inicio = 0, fin = 10): Observable<any> {

        return this._http.post(this.url + 'comments/' + coleccion + '/' + articleId + '/' + order, {inicio, fin});

    }

    saveComment(articleId: any, textComment: string, coleccion: string): Observable<any> {

        const token = this.getToken();

        if (token) {
            const data = {
                text: textComment
            }
            let params = JSON.stringify(data);
            let headers = new HttpHeaders({
                "Content-Type": "application/json",
                "x-token": token
            });

            return this._http.post(this.url + 'comments/' + coleccion + '/' + articleId, params, { headers });
        }


    }
}