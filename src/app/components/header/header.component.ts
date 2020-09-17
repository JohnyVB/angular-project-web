import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Global } from '../../services/global';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [UserService]
})
export class HeaderComponent implements OnInit {

  public login: any;
  public errorOn: boolean;

  public user: User;
  public url: string;

  public userOn: boolean;

  public searchString: string;

  constructor(
    private _userService: UserService,
    public _router: Router
  ) {

    this.userOn = false;
    this.errorOn = true;
    this.url = Global.url;
    this.user = new User('', '', '', '', [], '', '', '', '', null, '', '');

    this.login = {
      email: '',
      password: ''
    };

  }

  ngOnInit(): void {

    let token = this._userService.getToken();

    if (token) {
      this.getLogged();
    } else {
      this.userOn = false;
    }
  }

  getLogged() {
    this._userService.getUserLogged().subscribe(

      response => {

        this.user = response['user'];
        this.userOn = true;

      },
      error => {
        this.userOn = false;
        console.log('Error en el getLogged()', error);

      });
  }

  validarCampos() {
    if (this.login.email == '' && this.login.password == '') {
      this.errorOn = true;
    } else {
      this.errorOn = false;
    }
  }

  validarEmail() {
    if (this.login.email == '') {
      this.errorOn = !this.errorOn;
    } else {
      this.errorOn = !this.errorOn;
    }
  }

  validarPassword() {
    if (this.login.password == '') {
      this.errorOn = !this.errorOn;
    } else {
      this.errorOn = !this.errorOn;
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
        console.log('Error en el loginUser()', error);

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
