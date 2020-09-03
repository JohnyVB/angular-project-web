import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { CookieService } from "ngx-cookie-service";
import { Global } from './global';

@Injectable() export class ChapterService{
    
    public url: string;

    constructor(
        private _http: HttpClient,
        private cookie: CookieService
    ) { 
        this.url = Global.url;
    }

    getToken(){
        return this.cookie.get('token');
    }

    saveChapter(chapter: any, articleId: any):Observable<any>{
        const token = this.getToken();

        if (token) {
            let params = JSON.stringify(chapter);
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.post(this.url + 'save-chapter/' + articleId, params, { headers: headers });
        }else{
            console.log('No hay usuario logeado!!!');
        }
    }

    uploadPDF(file: File, chapterId: any):Observable<any>{
        let token = this.getToken();
        var formdata = new FormData();
        formdata.append("file0", file, file.name);

        if (token) {
            let headers = new HttpHeaders({ 'Authorization': "Bearer " + token });
            return this._http.put(this.url + 'upload-pages/' + chapterId, formdata, {headers: headers});
        }else{
            console.log('Usuario no logeado!!!');
            
        }
    }

    updateChapter(chapterId: any, chapter: any):Observable<any>{
        const token = this.getToken();
        if (token) {
            let params = JSON.stringify(chapter);
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });

            return this._http.put(this.url + '' + chapterId, params, {headers: headers});
        } else {
            console.log('No hay usuario logeado!!!');
        }
    }
    
}