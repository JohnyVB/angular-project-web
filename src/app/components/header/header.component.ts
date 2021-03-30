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

  constructor(
    private _userService: UserService,
    public _notifyService: NotifyService,
    public _router: Router
  ) {


    this.url = Global.url;

    this.login = {
      email: null,
      password: null
    };
    this.searchString = null;
    this.userActivo = null;
    this.user = new User('', '', '', '', '', '', null, null, '', null, null);

  }
  ngOnInit(): void {
    this.getToken()
  }

  getToken(){
    const token = this._userService.getToken();
    if (token) {
      this.getUserLogged();
    }
  }

  loginUser() {    
    this._userService.login(this.login).subscribe(
      response => {
        this.user = response.usuario;
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
      this.user = response.usuario;
      this.userActivo = true;
    },
      error => {
        this.userActivo = false;
      });
  }

  cerrarSession() {
    this._userService.sessionClosed();
    this.user = null;
    /* this._router.navigate(['/home']); */
  }

  sendString() {

    if (!this.searchString) {
      Swal.fire(
        'No hay datos para la busqueda',
        'Por favor ingrese datos para buscar',
        'warning'
      );
    }else{
      this._router.navigate(['/search/' + this.searchString]);
    }
  }
}
