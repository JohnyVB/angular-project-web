import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ArticleService } from '../../services/article.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Global } from '../../services/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService, ArticleService]
})
export class UsersComponent implements OnInit {

  public user: User;
  public url: string;
  public admin: boolean;
  public articles: Array<any>;
  public imageDefault: string;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _articleService: ArticleService
  ) {
    this.url = Global.url;
    this.admin = false;
    this.imageDefault = 'default-user.png';

  }

  ngOnInit(): void {

    const token = this._userService.getToken();   

    if (token) {
      this._userService.getUserAdmin(token).subscribe(response => {
        if (response.user.role === 'admin') {
          this.admin = true;
          this.getUsers();
        } else {
          this.admin = false;
        }
      },
        error => {
          console.log(error);

        });
    } else {
      console.log('No hay usuario');

    }

  }

  getUsers() {
    this._userService.getUsers().subscribe(
      response => {

        this.user = response.users;

      },
      error => {
        console.log(error);
      }
    );
  }

  deleteUser(userId: any) {

    Swal.fire({
      title: '¿Esta seguro?',
      text: "Una vez eliminado el usuario no podra ser recuperado",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })

    Swal.fire({
      title: '¿Esta seguro?',
      text: "Una vez eliminado el usuario no podra ser recuperado",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    })
      .then((result) => {
        if (result.isConfirmed) {

          this._userService.deleteUser(userId).subscribe(
            response => {

              if (response.user.article) {

                this.articles = response.user.article;

                response.user.article.forEach((articleId: any) => {
                  this._articleService.deleteArticle(articleId).subscribe(
                    response => {
                      console.log('Se ha borrado correctamente el libro asociado al usuario', response);
                    },
                    error => {
                      console.log('No se ha podido eliminar el articulo: ', error);

                    }
                  );
                });
              }

            },
            error => {
              console.log('Error al eliminar el usuario', error);

            }
          );
          this.ngOnInit();

          Swal.fire({
            title: "El usuario ha sido eliminado!",
            icon: "success",
          });
        } else if (result.isDenied) {
          Swal.fire({
            title: "El usuario no se ha eliminado",
            icon: "info"
          });
        }
      });
  }

}
