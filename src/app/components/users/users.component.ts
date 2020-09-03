import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Global } from '../../services/global';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService]
})
export class UsersComponent implements OnInit {

  public user: User[];
  public url: string;
  public noAdmin: boolean;

  constructor(
    private _userService: UserService
  ) { 
    this.url = Global.url;
    this.noAdmin = true;
  }

  ngOnInit(): void {

    const token = this._userService.getToken();

    if (token || token != '' || token != undefined) {
      this._userService.getUserAdmin(token).subscribe(response => {
        if (response.user.role == 'admin') {
          console.log(response.user.role);
          
          this.noAdmin = false;
          this.getUsers();
        } else {
          this.noAdmin = true;
        }
      },
        error => {
          console.log(error);

        });
    }else{
      console.log('No hay usuario');
      
    }
  
  }

  getUsers(){
    this._userService.getUsers().subscribe(
      response => {

        this.user = response.users;

      },
      error => {
        console.log(error);
      }
    );
  }

}
