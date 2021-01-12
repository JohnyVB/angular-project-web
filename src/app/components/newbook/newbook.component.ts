import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from '../../models/article';
import { ArticleService } from '../../services/article.service';
import { UserService } from '../../services/user.service';
import { Global } from '../../services/global';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-newbook',
  templateUrl: './newbook.component.html',
  styleUrls: ['./newbook.component.css'],
  providers: [ArticleService, UserService]
})
export class NewbookComponent implements OnInit {

  public article: Article;

  public listaTipo: string[] = ["Tipo 1", "Tipo 2", "Tipo 3"];
  public listaGeneros: string[] = ["Accion", "Aventura", "Ciencia ficcion", "Comedia", "Terror", "Drama", "Romance"];
  public listaEstado: string[] = ["Publicandose", "Abandonado", "Finalizado"];

  public validarExtend: any;
  public url: any;
  public userId: any;
  public fileImage: any;
  public file: any;
  public token: string;
  public imageDefault: string;
  public apiUrl: string;

  public parent: any;
  public evet: any;
  public errorOn: boolean;

  public articleId: string;

  constructor(
    private _router: Router,
    private _articleService: ArticleService,
    private _userService: UserService
  ) {
    this.article = new Article('', '', '', null, '', '', [], '', []);
    this.userId = '';
    this.errorOn = true;
    this.apiUrl = Global.url;
    this.imageDefault = 'defaultBook.jpg';
  }


  //------------------------------------ngOnInit()------------------------------------------------------------------
  ngOnInit(): void {
    this.token = this._userService.getToken();
    this._userService.getUserAdmin(this.token).subscribe(
      response => {
        this.userId = response.user._id;
      },
      error => {
        Swal.fire({
          title: 'Error al traer el usuario',
          text: 'Se produjo un error al consultar el usuario' + error,
          icon: 'error'
        });
      }
    );
  }

  //------------------------------------Validación de tipo de arhivo a subir----------------------------------------
  validarImagen(event: any) {
    if (this.article.image != '') {
      let extend = this.article.image.split('.')[1];
      this.validarExtend = extend;
      //console.log(event.target.files[0]);

      this.fileImage = event.target.files[0];

      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();

        reader.onload = (e: any) => {
          this.url = e.target.result;
          //console.log(this.url);

        }

        reader.readAsDataURL(event.target.files[0]);

      }
    }
  }


  //------------------------------------Envio de formulario al backend--------------------------------------------------
  onSubmit() {
    this._articleService.saveArticle(this.article, this.userId).subscribe(
      response => {
        Swal.fire(
          'Libro creado con exito!!',
          'El libro fue creado correctamente',
          'success'
        );
        this._router.navigate(['/book/' + response.articleStored._id]);
        this.uploadImage(response.articleStored._id);
      },
      error => {
        console.log('Error al guardar el articulo', error);

      }
    );
  }

  getFile(files: FileList) {

    this.file = files.item(0);

  }

  uploadImage(articleId: any) {
    this._articleService.uploadImage(this.file, articleId).subscribe(
      response => {
        console.log('La imagen se guardo con exito!!', response);

      },
      error => {
        console.log('Error al guardar la imagen', error);

      }
    );
  }

  validate(e: any) {

    this.parent = e.parentElement.lastChild;
    this.evet = e;

    if (!e.value) {
      this.parent.hidden = false;
      this.evet.className = "form-control border-danger ng-valid ng-dirty ng-touched";
    } else {
      this.parent.hidden = true;
      this.evet.className = "form-control border-success ng-valid ng-dirty ng-touched";
    }
  }

  validateEmty(){
    if (this.article.title != '' && this.article.description != '' && this.article.genders != '' && this.article.state != '' && this.article.type != '') {
      this.errorOn = false;
    }else{
      this.errorOn = true;
    }
  }

}
