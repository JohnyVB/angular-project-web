import { Component, OnInit, OnChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NotifyService } from '../../services/notify.service';
import { Global } from '../../services/global';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [UserService, NotifyService]
})
export class HeaderComponent implements OnInit, OnChanges {

  public login: any;
  public errorOn: boolean;
  public imageDefault: string;

  public user: User;
  public url: string;
  public alert: boolean;
 

  public userOn: boolean;

  public searchString: string;

  constructor(
    private _userService: UserService,
    public _notifyService: NotifyService,
    public _router: Router
  ) {

    this.userOn = false;
    this.errorOn = true;
    this.url = Global.url;
    this.alert = false;
    this.imageDefault = 'default-user.png';
    this.user = new User('', '', '', '', [], '', '', '', '', [], null, '', '');

    this.login = {
      email: '',
      password: ''
    };

  }

  ngOnChanges(){
    this.getLogged();
  }

  ngOnInit(): void {
    this.getLogged();
    
  }

  getLogged() {
    this._userService.getUserLogged().subscribe(
      response => {
        if (response) {
          this.user = response.user;
          this.userOn = true;
          this.notifyAlert();
        }
      },
      error => {
        this.userOn = false;
      });
  }

  notifyAlert(){
    this.user.notify.forEach((noti:any) => {
      if (noti.alert) {
        this.alert = true;
      }else{
        this.alert = false;
      }
    });
  }


  validarEmail() {
    if (!this.login.email) {
      this.errorOn = true;
    } else {
      this.errorOn = false;
    }
  }

  validarPassword() {
    if (!this.login.password) {
      this.errorOn = true;
    } else {
      this.errorOn = false;
    }
  }

  loginUser() {
    this._userService.login(this.login).subscribe(

      response => {
        this._userService.setToken(response.userUpdated.token);
        this.user = response.userUpdated;
        this.userOn = true;
        this.ngOnInit();
      },
      error => {
        console.log('Campos vacios para iniciar sesion', error);

      });
  }

  cerrarSession() {

    this._userService.sessionClosed();
    this.userOn = false;
    this.ngOnInit();

  }

  sendString() {
    this._router.navigate(['/search/' + this.searchString]);
  }


}
