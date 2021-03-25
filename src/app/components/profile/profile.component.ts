import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { Article } from '../../models/article';
import { UserService } from '../../services/user.service';
import { ArticleService } from '../../services/article.service';
import { Global } from '../../services/global';
import Swal from "sweetalert2";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, ArticleService]
})
export class ProfileComponent implements OnInit {

  public user: User;
  public articles: Article[];
  public cantidadArticles: number;
  public url: string;
  public userId: string;
  public userProp: boolean;
  public confirmPassword: string;
  public editOn: boolean;
  public imageUser: string;
  public file: File;
  public imageUpdate: any;
  public archivosValidos: Array<string>;

  constructor(
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _articleService: ArticleService
  ) {
    this.user = new User('', '', '', '', '', '', null, null, '', null, null);
    this.url = Global.url;
    this.userProp = false;
    this.editOn = false;
    this.confirmPassword = '';
    this.imageUser = null;
    this.file = null;
    this.imageUpdate = 'https://res.cloudinary.com/dr0wxllnu/image/upload/v1615497606/backend-lector/default/default-user_bur2mh.png';
    this.archivosValidos = ['image/png', 'image/jpg', 'image/jpeg'];
    this.articles = [];
  }

  ngOnInit(): void {
    this.getParams();
  }

  getParams() {
    this._route.params.subscribe(
      params => {
        this.userId = params.id;
        this.getUser(params.id);
      },
      error => {
        console.log('Error al obtener el id del usuario', error);
      });
  }

  getUser(userId: string) {
    this._userService.getUser(userId).subscribe(
      response => {
        this.user = response.usuario;
        this.getArticlesPorUser(response.usuario._id);
        this.getUserLogged(response.usuario._id);
      },
      error => {
        console.log('Error al obtener el usuario', error);
      });
  }

  getArticlesPorUser(userId: string) {
    this._articleService.getArticlesPorUser(userId).subscribe(
      response => {
        this.articles = response.articles;
        this.cantidadArticles = response.total;
      },
      error => {
        console.log('Error al obtener los articulos del usuario', error);
      }
    );
  }

  getUserLogged(userId: string) {
    this._userService.getUserLogged().subscribe(
      response => {
        if (response.usuario._id === userId) {
          this.userProp = true;
        } else {
          this.userProp = false;
        }
      },
      error => {
        console.log(error);

      }
    );
  }

  editUser() {
    this.editOn = !this.editOn;
  }

  getFile(file: FileList) {
    this.file = file.item(0);

    if (this.archivosValidos.includes(this.file.type)) {
      let reader = new FileReader();

      reader.onload = (e: any) => {
        this.imageUpdate = e.target.result;
      }

      reader.readAsDataURL(this.file);
    }
  }

  actualizarUsuario() {

    this._userService.updateUser(this.user._id, this.user).subscribe(
      response => {

        this.editOn = false;
        this.getUser(this.user._id);

      },
      error => {
        console.log(error);
      }
    );

  }

  updateImage() {

    if (this.file) {
      this._userService.uploadImageUser(this.file, this.user._id).subscribe(
        response => {
          this.editOn = false;
          this.getUser(this.user._id);
          document.getElementById('modalImagenUsuario').click();
        },
        error => {
          console.log(error);
        }
      );
    }else{
      Swal.fire(
        'No hay imagen',
        'No se ha seleccionado ninguna imagen para subir',
        'info'
      );
    }

  
  }


}
