import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public login: any;
  public errorOn: boolean;

  constructor(
    public _userService: UserService,
    public _router: Router
  ) {
    this.login = {
      email: '',
      password: ''
    };
    this.errorOn = false;
   }

  ngOnInit(): void {
  }

  validarEmail(){
    if (this.login.email == '') {
      this.errorOn = true;
    }else{
      this.errorOn = false;
    }
  }

  validarPassword(){
    if (this.login.password == '') {
      this.errorOn = true;
    }else{
      this.errorOn = false;
    }
  }

  loginUser(){
    this._userService.login(this.login).subscribe(data => {
      this._userService.setToken(data.userUpdated.token);
      console.log(data);
      this._router.navigate(['/home']);
    },
    error => {
      console.log(error);      
    });
  }

}
