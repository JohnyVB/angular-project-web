import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Global } from './global';
import { CookieService } from "ngx-cookie-service";



@Injectable() export class UserService {

    public url: string;

    constructor(
        private _http: HttpClient,
        private cookie: CookieService
    ) {
        this.url = Global.url;
    }

    login(login: any): Observable<any> {

        return this._http.post(this.url + 'auth/login', login);
    }

    getUserLogged(): Observable<any> {

        const token = this.getToken();
        return this._http.get(this.url + 'users/key/' + token);

    }

    setToken(token: string) {
        this.cookie.set("x-token", token);
    }

    getToken() {
        return this.cookie.get('x-token');
    }

    sessionClosed() {
        this.cookie.delete('x-token');
    }

    register(user: User): Observable<any> {
        return this._http.post(this.url + 'users/', user);
    }

    uploadImageUser(file: File, userId: any): Observable<any> {
        const formdata = new FormData();
        formdata.append("archivo", file, file.name);
        return this._http.patch(this.url + 'uploads/users/' + userId, formdata);
    }

    getUser(userid: string): Observable<any> {
        return this._http.get(this.url + 'users/' + userid);
    }

    getUserXArticle(articleId: string): Observable<any> {
        return this._http.get(this.url + 'users/article/' + articleId);
    }


    updateUser(userId: any, user: any): Observable<any> {
        const token = this.getToken();

        let params = JSON.stringify(user);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-token': token
        });

        return this._http.put(this.url + 'users/' + userId, params, { headers: headers });

    }

    getUsers(): Observable<any> {

        const token = this.getToken();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-token': token
        });

        return this._http.get(this.url + 'users', { headers: headers });

    }

    deleteUser(userId: any): Observable<any> {
        const token = this.getToken();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-token': token
        });

        return this._http.patch(this.url + 'users/' + userId, null, { headers: headers });

    }

}