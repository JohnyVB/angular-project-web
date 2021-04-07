import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Global } from '../../services/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService]
})
export class UsersComponent implements OnInit {

  public users: User[];
  public url: string;

  constructor(
    private _userService: UserService
  ) {
    this.url = Global.url;
    this.users = [];
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this._userService.getUsers().subscribe(
      response => {
        this.users = response.usuarios;
      }
    )
  }

  deleteUser(userId: string){
    Swal.fire({
      title: '¿Esta seguro de eliminar el usuario?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      
      if (result.isConfirmed) {

        this._userService.deleteUser(userId).subscribe(
          response => {
            this.getUsers();
            Swal.fire('Usuario eliminado!', '', 'success')
          },
          error => {
            Swal.fire('Usuario no ha sido eliminado', '', 'info');
            console.log(error);
            
          }
        );
      } else if (result.isDenied) {
        Swal.fire('Usuario no ha sido eliminado', 'Cancelado por usuario', 'info')
      }
    })
  }
}
