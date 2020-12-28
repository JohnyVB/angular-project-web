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

    //------------------------Obtener token de usuario logeado-------------------------------------------
    getToken() {
        return this.cookie.get('token');
    }

    //------------------------Servicio de mostrar todos los libros---------------------------------------
    getArticles(): Observable<any> {
        return this._http.get(this.url + 'libraryHome');
    }

    getArticlesLibrary(): Observable<any> {
        return this._http.get(this.url + 'library');
    }

    getArticlesChapters(): Observable<any> {
        return this._http.get(this.url + 'get-articles-chapter');
    }

    //------------------------Servicio de mostrar todos los libros con Populate--------------------------
    getArticlesXpopulate(): Observable<any> {
        return this._http.get(this.url + 'get-article-populate');
    }

    //------------------------Servicio de mostrar un libro y sus capitulos-------------------------------
    getArticleService(articleId: string): Observable<any> {
        return this._http.get(this.url + 'get-chapters-populate/' + articleId);
    }

    getArticleXchapter(chapterId: string):Observable<any>{
        return this._http.get(this.url + 'get-articlexchapter/' + chapterId);
    }

    search(searchString: string): Observable<any> {
        return this._http.get(this.url + 'search/' + searchString);
    }

    saveArticle(article: any , userId: any): Observable<any> {

        let token = this.getToken();

        if (token) {
            let params = JSON.stringify(article);
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.post(this.url + 'save-book/' + userId, params, {headers: headers});
        } else {
            return this._http.get(this.url + 'error');
        }


    }

    uploadImage(file: File, articleId: any):Observable<any>{
        let token = this.getToken();

        var formdata = new FormData();
        formdata.append("file0", file, file.name);

        if (token) {
          
            let headers = new HttpHeaders({ 'Authorization': "Bearer " + token });
            return this._http.post(this.url + 'upload-coverpages/' + articleId, formdata, { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }
    }

    updateArticle(articleId: any, article: any): Observable<any>{
        const token = this.getToken();
        if (token) {
            let params = JSON.stringify(article);
            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            });

            return this._http.put(this.url + 'update-article/' + articleId, params, {headers: headers});
        } else {
            return this._http.get(this.url + 'error');
        }
    }

    deleteArticle(articleId: any):Observable<any>{
        const token = this.getToken();

        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.delete(this.url + 'delete-book/' + articleId, {headers: headers});
        } else {
            return this._http.get(this.url + 'error');
        }
    }

}