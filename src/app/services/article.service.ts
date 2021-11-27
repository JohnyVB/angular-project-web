import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { CookieService } from "ngx-cookie-service";


@Injectable() export class ArticleService {

    public url: string;

    constructor(
        private _http: HttpClient,
        private cookie: CookieService
    ) {
        this.url = Global.url;
    }


    getToken() {
        return this.cookie.get('x-token');
    }


    getArticles(end: number): Observable<any> {
        return this._http.post(this.url + 'articles', {end});
    }

    getArticle(id: string): Observable<any> {
        return this._http.get(this.url + 'articles/' + id);
    }

    saveArticle(article: any): Observable<any> {

        let token = this.getToken();

        if (token) {
            let params = JSON.stringify(article);
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-token': token });
            return this._http.post(this.url + 'articles', params, { headers: headers });
        }

    }

    uploadImage(file: File, articleId: string): Observable<any> {

        let formdata = new FormData();
        formdata.append("archivo", file, file.name);
        return this._http.patch(this.url + 'uploads/articles/' + articleId, formdata);

    }

    getArticlesPorUser(userId: string): Observable<any> {
        return this._http.get(this.url + 'articles/user/' + userId);
    }

    updateArticle(article: any, articleId: any): Observable<any> {
        const token = this.getToken();
        if (token) {
            let params = JSON.stringify(article);
            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-token': token
            });

            return this._http.put(this.url + 'articles/' + articleId, params, { headers: headers });
        }
    }

    patchArticle(articleId: string): Observable<any> {

        const token = this.getToken();

        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-token': token });
            return this._http.patch(this.url + 'articles/' + articleId, '', { headers: headers });
        }
    }

}