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

    setToken(token: string) {
        //this.cookie.set("token", token);
        sessionStorage.setItem("tokenSession", token);
    }

    getToken() {
        //return this.cookie.get('token');
        return sessionStorage.getItem('tokenSession');
    }

    sessionClosed() {
        //this.cookie.delete('token');
        sessionStorage.removeItem("tokenSession");
    }


    getUsers(): Observable<any> {

        const token = this.getToken();
        if (token) {

            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            });

            return this._http.get(this.url + 'get-users', { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }

    }


    login(user: User): Observable<any> {
        return this._http.post(this.url + 'login', user);
    }

    register(user: User): Observable<any> {
        return this._http.post(this.url + 'save-user', user);
    }



    getUserLogged(): Observable<any> {

        const token = this.getToken();

        if (token) {
            return this._http.get(this.url + 'get-usertoken/' + token);
        } else {
            return this._http.get(this.url + 'error');
        }

    }

   

    getUserXArticle(articleId: string, reader: any): Observable<any> {
        return this._http.get(this.url + 'get-userxarticle/' + articleId + '/' + reader);
    }

    getUserXEmail(email: string): Observable<any> {
        return this._http.get(this.url + 'get-userxemail/' + email);
    }

    getUserPopulateArticle(userId: string): Observable<any> {
        return this._http.get(this.url + 'get-user-populate/' + userId);
    }

    getUserAdmin(token: string): Observable<any> {
        return this._http.get(this.url + 'get-userxtoken/' + token);
    }

    getUser(userid: any): Observable<any> {
        return this._http.get(this.url + 'get-user/' + userid);
    }

    uploadImageUser(file: File, userId: any): Observable<any> {
        const formdata = new FormData();
        formdata.append("file0", file, file.name);
        return this._http.post(this.url + 'upload-user/' + userId, formdata);
    }

    updateUser(userId: any, user: User): Observable<any> {
        const token = this.getToken();
        if (token) {
            let params = JSON.stringify(user);
            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            });

            return this._http.put(this.url + 'update-user/' + userId, params, { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }
    }
    updateUserParam(userid: any, params: any): Observable<any> {

        const token = this.getToken();
        if (token) {
            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            });

            return this._http.put(this.url + "update-user/" + userid, params, { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }


    }

    deleteUser(userId: any): Observable<any> {
        const token = this.getToken();

        if (token) {
            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            });

            return this._http.delete(this.url + 'delete-user/' + userId, { headers: headers });
        } else {
            return this._http.get(this.url + 'error');
        }
    }

}