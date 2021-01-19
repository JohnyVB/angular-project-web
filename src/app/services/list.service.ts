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

    saveList(userid: any, params: any): Observable<any> {
        const token = this.getToken();

        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.post(this.url + "save-list/" + userid, params, { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }
    }

    addBookToList(listid: any, articleid: any): Observable<any> {
        const token = this.getToken();

        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.put(this.url + "add-book-list/" + listid, articleid, { headers: headers });
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

    editList(listid: any, params: any): Observable<any> {
        const token = this.getToken();

        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.put(this.url + "edit-list/" + listid, params, { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }
    }

    deleteList(listid: string): Observable<any> {
        const token = this.getToken();

        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.delete(this.url + "delete-list/" + listid, { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }
    }

    deleteBookList(articleid: string): Observable<any> {
        const token = this.getToken();
        
        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.get(this.url + "delete-booklist/" + articleid, { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }
    }

    getListArticle(articleid:string):Observable<any>{
        const token = this.getToken();

        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.get(this.url + "get-list-article/" + articleid, { headers: headers }); 
        }else{
            return this._http.get(this.url + 'error');
        }
    }

    updateUserList(listid:any, params:any):Observable<any>{
        const token = this.getToken();

        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer " + token });
            return this._http.put(this.url + "update-user-list/" + listid, params, { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }
    }
}