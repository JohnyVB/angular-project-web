import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Article } from '../../models/article';
import { ArticleService } from '../../services/article.service';


@Component({
  selector: 'app-newbook',
  templateUrl: './newbook.component.html',
  styleUrls: ['./newbook.component.css'],
  providers: [ArticleService]
})
export class NewbookComponent implements OnInit {

  public article: Article;

  public listaTipo: string[] = ["Tipo 1", "Tipo 2", "Tipo 3"];
  public listaGeneros: string[] = ["Accion", "Aventura", "Ciencia ficcion", "Comedia", "Terror", "Drama", "Romance"];
  public listaEstado: string[] = ["Publicandose", "Abandonado", "Finalizado"];

  public _titleIsEmpty: boolean;
  public _descriptionIsEmpty: boolean;
  public _typeIsEmpty: boolean;
  public _gendersIsEmpty: boolean;
  public _stateIsEmpty: boolean;

  public validarExtend: any;
  public url: any;
  public userId: string;
  public fileImage: any;
  public file: any;

  public articleId: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _articleService: ArticleService
  ) {

    this.article = new Article('', '', '', null, '', '', [], '', []);

    this.userId = '';

    this._titleIsEmpty = false;
    this._descriptionIsEmpty = false;
    this._typeIsEmpty = false;
    this._gendersIsEmpty = false;
    this._stateIsEmpty = false;

  }

  //------------------------------------Recojer el id del usuario---------------------------------------------------
  getIdUser() {
    this._route.params.subscribe(
      (params: Params) => {
        this.userId = params.id;
      },
      (error) => {
        console.log('Error al traer el id de usuario', error);

      }
    );
  }


  //------------------------------------ngOnInit()------------------------------------------------------------------
  ngOnInit(): void {
    this.getIdUser();
  }



  //------------------------------------validación de campos obligatorios-------------------------------------------
  titleIsEmpty() {
    if (this.article.title == '' || this.article.title == null || this.article.title == undefined) {
      this._titleIsEmpty = true;
    } else {
      this._titleIsEmpty = false;
    }
  }

  descriptionIsEmpty() {
    if (this.article.description == '' || this.article.description == null || this.article.description == undefined) {
      this._descriptionIsEmpty = true;
    } else {
      this._descriptionIsEmpty = false;
    }
  }

  typeIsEmpty() {
    if (this.article.type == '' || this.article.type == null || this.article.type == undefined) {
      this._typeIsEmpty = true;
    } else {
      this._typeIsEmpty = false;
    }
  }

  gendersIsEmpty() {
    if (this.article.genders.length == 0 || this.article.genders == [] || this.article.genders == [null] || this.article.genders == [undefined]) {
      this._gendersIsEmpty = true;
    } else {
      this._gendersIsEmpty = false;
    }
  }

  stateIsEmpty() {
    if (this.article.state == '' || this.article.state == null || this.article.state == undefined) {
      this._stateIsEmpty = true;
    } else {
      this._stateIsEmpty = false;
    }
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
        alert('Libro creado correctamente!!');
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

  uploadImage(articleId: any){
    this._articleService.uploadImage(this.file, articleId).subscribe(
      response => {
        console.log('La imagen se guardo con exito!!', response);

      },
      error => {
        console.log('Error al guardar la imagen', error);

      }
    );
  }

}
