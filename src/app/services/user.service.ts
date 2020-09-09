import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Global } from './global';
import { CookieService } from "ngx-cookie-service";



@Injectable() export class UserService {

    public url: string;
    public token: string;

    constructor(
        private _http: HttpClient,
        private cookie: CookieService
    ) {
        this.url = Global.url;
    }

    setToken(token: string) {
        this.cookie.set("token", token);
    }

    getToken() {
        return this.cookie.get("token");
    }


    getUsers(): Observable<any> {

        const token = this.getToken();
        if (token) {

            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            });
           
            
            return this._http.get(this.url + 'get-users', {headers: headers});
        }

    }


    login(user: User): Observable<any> {
        return this._http.post(this.url + 'login', user);
    }

    register(user: User): Observable<any> {
        return this._http.post(this.url + 'save-user', user);
    }

    

    getUserLogged() {

        this.token = this.getToken();

        if (!this.token) {
            return this._http.get(this.url + 'get-usertoken/');
        }
        return this._http.get(this.url + 'get-usertoken/' + this.token);
    }

    sessionClosed() {
        this.cookie.delete('token');
    }

    getUserXArticle(articleId: string): Observable<any>{
        return this._http.get(this.url + 'get-userxarticle/' + articleId);
    }

    getUserPopulateArticle(userId: string): Observable<any>{
        return this._http.get(this.url + 'get-user-populate/' + userId);
    }

    getUserAdmin(token: string):Observable<any>{
        return this._http.get(this.url + 'get-userxtoken/' + token);
    }

    uploadImageUser(file: File, userId: any):Observable<any>{
        var formdata = new FormData();
        formdata.append("file0", file, file.name);
        return this._http.post(this.url + 'upload-user/' + userId, formdata);
    }

    updateUser(userId: any, user: any):Observable<any>{
        const token = this.getToken();
        if (token) {
            let params = JSON.stringify(user);
            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            });

            return this._http.put(this.url + 'update-user/' + userId, params, {headers: headers});

        }else{
            console.log('Usuario no logeado');
            
        }
    }

    deleteUser(userId: any):Observable<any>{
        const token = this.getToken();

        if (token) {
            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            });

            return this._http.delete(this.url + 'delete-user/' + userId, {headers: headers});
        }else{
            console.log('Usuario no logeado'); 
        }
    }

}