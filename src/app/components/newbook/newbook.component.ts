import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Global } from '../../services/global';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-newbook',
  templateUrl: './newbook.component.html',
  styleUrls: ['./newbook.component.css'],
  providers: [ArticleService]
})
export class NewbookComponent implements OnInit {

  public article: any;
  public file: File;
  public url: string;
  public urlImage: string;
  public listaTipo: string[] = ["Web novel", "Comic", "Manga", "Manhwa"];
  public listaGeneros: string[] = ["Accion", "Aventura", "Ciencia ficcion", "Comedia", "Terror", "Drama", "Romance"];
  public listaEstado: string[] = ["Publicandose", "Abandonado", "Finalizado"];

  constructor(
    private _router: Router,
    private _articleService: ArticleService,
  ) {
    this.article = {
      image: null,
      title: '',
      description: '',
      type: '',
      genders: [],
      progress: ''
    }
    this.url = Global.url;
    this.file = null
    this.urlImage = 'https://res.cloudinary.com/dr0wxllnu/image/upload/v1615497606/backend-lector/default/defaultBook_njteg0.jpg';
  }

  ngOnInit(): void {

  }

  getFile(event: any) {
    this.file = event.target.files;
    if (this.file) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.urlImage = e.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  saveArticle() {
    this._articleService.saveArticle(this.article).subscribe(
      response => {
        if (this.article.image) {
          this.uploadImage(response.articulo._id);
        }else{
          Swal.fire(
            'Libro creado',
            'Se ha creado correctamente tu libro',
            'success'
          );
          this._router.navigate(['/book/' + response.articulo._id]);
        }
        
      },
      error => {
        console.log(error);
        Swal.fire(
          'Error',
          'Se ha producido un error al crear el libro',
          'error'
        );
      }
    );
  }

  uploadImage(articleId: string) {
    this._articleService.uploadImage(this.file[0], articleId).subscribe(
      response => {
        this._router.navigate(['/book/' + response.modelo._id]);
      },
      error => {
        console.log(error);
      }
    );
  }


}
