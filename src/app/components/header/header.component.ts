import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NotifyService } from '../../services/notify.service';
import { Global } from '../../services/global';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [UserService, NotifyService]
})
export class HeaderComponent implements OnInit {

  public login: any;
  public user: User;
  public userActivo: boolean;
  public url: string;
  public searchString: string;
  public cookieTheme: any;
  public messageSocket:string;

  constructor(
    private _userService: UserService,
    private _notifyService: NotifyService,
    private _router: Router
  ) {

    this.messageSocket = null;
    this.url = Global.url;

    this.login = {
      email: null,
      password: null
    };
    this.searchString = null;
    this.userActivo = null;
    this.user = new User('', '', '', '', '', '', null, null, '', null, null, null);

  }
  ngOnInit(): void {
    this.getToken()
    this.themePage()
  }

  themePage() {
    const toggle = document.querySelector('#toggleTheme');
    const root = document.documentElement;
    this.cookieTheme = this._userService.getTheme();

    if (this.cookieTheme === 'dark') {
      toggle.setAttribute('checked', 'true');
    } else {
      toggle.removeAttribute('checked');
    }

    root.setAttribute('data-theme', this.cookieTheme);
  }

  changeTheme(e:any) {
    const root = document.documentElement;
    if (e.checked) {
      root.setAttribute('data-theme', 'dark');
      this._userService.removeTheme();
      this._userService.setTheme('dark');
    }else{
      root.setAttribute('data-theme', 'light');
      this._userService.removeTheme();
      this._userService.setTheme('light');
    }
    
  }


  getToken() {
    const token = this._userService.getToken();
    if (token) {
      this.getUserLogged();
    }
  }

  loginUser() {
    this._userService.login(this.login).subscribe(
      response => {
        this.user = response.usuario;

        if (!this.user.state && this.user.validatorNumber) {
          return this._router.navigate(['/activatoruser/' + this.user.email]);
        }

        this._userService.setToken(response.token);
        this._router.navigate(['/home']);
        this.userActivo = true;
      },
      error => {
        this.userActivo = false;
        Swal.fire(
          'Error al ingresar',
          'Las credenciales no concuerdan',
          'error'
        );
      });
  }

  getUserLogged() {
    this._userService.getUserLogged().subscribe(response => {

      if (response.usuario) {
        this.user = response.usuario;
        this.getNotify(response.usuario._id);
        this.userActivo = true;
      } else {
        this.userActivo = false;
      }

    },
      error => {
        console.log(error);

      });
  }

  getNotify(userid: any) {
    this._notifyService.getNotifys(userid).subscribe(
      response => {
        this._notifyService.notifyCount = response.totalNews;
      },
      error => {
        console.log(error);
      });
  }

  cerrarSession() {
    this.user = null;
    this._userService.sessionClosed();
    this._router.navigate(['/home']);
  }

  sendString() {

    if (!this.searchString) {
      Swal.fire(
        'No hay datos para la busqueda',
        'Por favor ingrese datos para buscar',
        'warning'
      );
    } else {
      this._router.navigate(['/search/' + this.searchString]);
    }
  }
}
