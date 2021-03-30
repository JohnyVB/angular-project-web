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
        return this.cookie.get('x-token');
    }

    getLists(userid: string): Observable<any> {
        const token = this.getToken();
        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-token': token });
            return this._http.get(this.url + "lists/" + userid, { headers: headers });
        }

    }

    getListPorArticle(userId: string, article: string): Observable<any> {
        const token = this.getToken();
        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-token': token });
            return this._http.get(this.url + "lists/article/" + userId + '/' + article, { headers: headers });
        }
    }

    addBookToList(listId: string, article: string): Observable<any> {
        const token = this.getToken();
        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-token': token });
            return this._http.put(this.url + "lists/" + listId, { article }, { headers: headers });
        }

    }

    saveList(data: any): Observable<any> {
        const token = this.getToken();

        if (token) {
            let params = JSON.stringify(data)
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-token': token });
            return this._http.post(this.url + "lists", params, { headers: headers });
        }
    }

    editList(listid: any, name: any): Observable<any> {
        const token = this.getToken();

        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-token': token });
            return this._http.put(this.url + "lists/editlist/" + listid, { name }, { headers: headers });
        }
    }

    deleteList(listid: string): Observable<any> {
        const token = this.getToken();

        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-token': token });
            return this._http.patch(this.url + "lists/" + listid, null,{ headers: headers });
        } 
    }

    deleteBookList(listId: string, article: string): Observable<any> {
        const token = this.getToken();

        if (token) {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-token': token });
            return this._http.patch(this.url + "lists/deletebook/" + listId, { article }, { headers: headers });
        } 
    }

}