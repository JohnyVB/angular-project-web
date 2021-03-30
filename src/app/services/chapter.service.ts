import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";
import { Global } from './global';

@Injectable() export class ChapterService {

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

    getChapters(cantidad: number): Observable<any> {
        return this._http.get(this.url + 'chapters/count/' + cantidad);
    }

    getChaptersPorUnArticle(articleid: string, order: number): Observable<any> {
        return this._http.get(this.url + 'chapters/art/' + articleid + '/' + order);
    }

    saveChapter(chapter: any, articleId: string): Observable<any> {
        const token = this.getToken();

        if (token) {
            let params = JSON.stringify(chapter);
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-token': token });
            return this._http.post(this.url + 'chapters/' + articleId, params, { headers: headers });
        }
    }

    uploadFile(file: File, chapterId: any): Observable<any> {

        let formdata = new FormData();
        formdata.append("archivo", file, file.name);
        return this._http.patch(this.url + 'uploads/chapters/' + chapterId, formdata);
    }

    getChapter(chapterId: any): Observable<any> {

        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this._http.get(this.url + 'chapters/' + chapterId, { headers: headers })

    }









    updateChapter(chapterId: any, chapter: any): Observable<any> {
        const token = this.getToken();
        if (token) {
            let params = JSON.stringify(chapter);
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });

            return this._http.put(this.url + 'update-chapter/' + chapterId, params, { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }
    }

    deleteChapter(chapterId: string) {
        const token = this.getToken();

        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.delete(this.url + 'delete-chapter/' + chapterId, { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }
    }

}