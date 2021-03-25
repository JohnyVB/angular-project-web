import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Article } from '../../models/article';
import { ArticleService } from '../../services/article.service';
import { UserService } from '../../services/user.service';
import { ChapterService } from '../../services/chapter.service';
import { ListService } from '../../services/list.service';
import { Global } from '../../services/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  providers: [ArticleService, UserService, ChapterService, ListService]
})
export class BookComponent implements OnInit {

  public url: string;
  public articleid: string;
  public article: Article;
  public userId: string;
  public file: any;
  public urlImage: any;
  public editOn: boolean;
  public commentsOn: boolean;
  public chaptersOn: boolean;
  public userProp: boolean;
  public updateArticle: any;

  public listaTipo: string[] = ["Tipo 1", "Tipo 2", "Tipo 3"];
  public listaGeneros: string[] = ["Accion", "Aventura", "Ciencia ficcion", "Comedia", "Terror", "Drama", "Romance"];
  public listaEstado: string[] = ["Publicandose", "Abandonado", "Finalizado"];

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _articleService: ArticleService,
    private _userService: UserService,
    private _chapterService: ChapterService,
    private _listService: ListService
  ) {

    this.url = Global.url;
    this.urlImage = null;
    this.editOn = false;
    this.commentsOn = true;
    this.chaptersOn = false;
    this.article = new Article('', '', '', '', null, '', null, '', null, '');
    this.updateArticle = {
      title: '',
      description: '',
      progress: '',
      genders: []
    }
    this.userProp = false;
    this.userId = '';
    this.urlImage = 'https://res.cloudinary.com/dr0wxllnu/image/upload/v1615497606/backend-lector/default/defaultBook_njteg0.jpg'

  }

  ngOnInit(): void {
    this.getparams();
  }

  toggle(){
    this.commentsOn = !this.commentsOn;
    this.chaptersOn = !this.chaptersOn;
  }

  toggleEdit(){
    this.editOn = !this.editOn;
  }

  getparams(){
    this._route.params.subscribe(
      response => {
        this.articleid = response.id;
        this.getArticle(response.id);
      },
      error => {
        console.log('Error al traer el id del articulo');
      }
    );
  }

  getArticle(articleId: string){
    this._articleService.getArticle(articleId).subscribe(
      response => {
        this.article = response.articulo;
        this.getUserLogged();
      },
      error => {
        console.log('Error al traer el articulo', error);
      }
    );
  }


  getUserLogged(){
    this._userService.getUserLogged().subscribe(
      response => {
        this.userId = response.usuario._id;
        if (this.userId === this.article.user['_id']) {
          this.userProp = true;
        }else{
          this.userProp = false;
        }        
      },
      error => {
        console.log(error);
        
      }
    );
  }

  getFile(files: FileList) {
    this.file = files.item(0);
    let reader = new FileReader();

    reader.onload = (e: any) => {
      this.urlImage = e.target.result;
    }

    reader.readAsDataURL(this.file);
  }

  updateImage(){
    this._articleService.uploadImage(this.file, this.articleid).subscribe(
      response => {
        this.getArticle(response.modelo._id);
        document.getElementById('modalImagenLibro').click();
      },
      error => {
        console.log(error);
        
      }
    );
  }

  editArticle(){

    const {...data} = this.updateArticle
    const dataUpdate = {
      ...data
    }
    
    this._articleService.updateArticle(dataUpdate, this.articleid).subscribe(
      response => {
        this.editOn = false;
        this.getArticle(response.articulo._id);
      },
      error => {
        console.log(error);
        
      }
    );
  }


  deleteArticle(){
    Swal.fire({
      title: '¿Esta seguro de eliminar el libro?',
      text: "Una vez eliminado no se podra recuperar!",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this._articleService.patchArticle(this.articleid).subscribe(
          response => {            
            Swal.fire({
              text: "El libro de ha eliminado correctamente",
              icon: "success",
            });

            this._router.navigate(['/profile/' + this.userId]);
          },
          error => {
            console.log(error);
          }
        );
      } else if (result.isDenied) {
        Swal.fire({
          title: "No se ha eliminado el libro!",
          icon: 'info'
        });
      }
    })
  }





 




  /* deleteArticle(articleId: any) {

    Swal.fire({
      title: '¿Esta seguro de eliminar el libro?',
      text: "Una vez eliminado no se podra recuperar!",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    })
      .then((result) => {
        if (result.isConfirmed) {

          this._articleService.deleteArticle(articleId).subscribe(
            response => {
              console.log('El libro ha sido eliminado correctamente', response);
              this._router.navigate(['/profile/' + this.user._id]);

            },
            error => {
              console.log('Error al borrar el libro', error);

            }
          );
        } else if (result.isDenied) {
          Swal.fire({
            title: "No se ha eliminado el libro!",
            icon: 'info'
          });
        }
      });
  } */


}
