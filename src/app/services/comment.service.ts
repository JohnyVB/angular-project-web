import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';
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
        return this.cookie.get("token");
    }

    getComments(articleId: string, reader: boolean): Observable<any> {

        return this._http.get(this.url + 'get-commentspopulate/' + articleId + '/' + reader);

    }

    saveComment(articleId: any, comment: Comment, reader: boolean): Observable<any> {

        const token = this.getToken();

        if (token) {
            let params = JSON.stringify(comment);
            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            });
            return this._http.post(this.url + 'save-comment/' + articleId + '/' + reader, params, { headers: headers });

        } else {
            return this._http.get(this.url + 'error');
        }
        

    }
}