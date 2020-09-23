import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Article } from '../../models/article';
import { User } from '../../models/user';
import { Chapter } from '../../models/chapter';
import { ArticleService } from '../../services/article.service';
import { UserService } from '../../services/user.service';
import { ChapterService } from '../../services/chapter.service';
import { Global } from '../../services/global';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  providers: [ArticleService, UserService, ChapterService]
})
export class BookComponent implements OnInit {


  public article: Article;
  public user: User;
  public chapter: Chapter;
  public chapterId: any;
  public Id: string;
  public url: string;
  public articleSearch: Array<any>;
  public userXarticle: boolean;
  public file: any;
  public fileChapter: any
  public urlImage: any;
  public editOn: boolean;
  public errFileChapter: boolean;

  public listaTipo: string[] = ["Tipo 1", "Tipo 2", "Tipo 3"];
  public listaGeneros: string[] = ["Accion", "Aventura", "Ciencia ficcion", "Comedia", "Terror", "Drama", "Romance"];
  public listaEstado: string[] = ["Publicandose", "Abandonado", "Finalizado"];

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _articleService: ArticleService,
    private _userService: UserService,
    private _chapterService: ChapterService
  ) {

    this.url = Global.url;
    this.userXarticle = false;
    this.urlImage = '';
    this.editOn = false;
    this.Id = '';
    this.errFileChapter = null;
    this.chapterId = '';

    this.article = new Article('', '', '', '', '', '', [], '', []);
    this.user = new User('', '', '', '', [], '', '', '', '', null, '', '');
    this.chapter = new Chapter('', null, '', null, '');

  }


  ngOnInit(): void {
    this._route.params.subscribe(
      response => {
        this.Id = response.id;
      },
      error => {
        console.log('Error al traer el id del articulo');
      }
    );

    this._articleService.getArticleService(this.Id).subscribe(
      response => {
        this.article = response.article;
      },
      error => {
        console.log('Error al traer el articulo');
      }
    );

    this._userService.getUserXArticle(this.Id).subscribe(
      response => {
        this.user = response.user;
        this.getUserLogged();
      },
      error => {
        console.log('Error al traer el usuario');
      }
    );

  }

  getUserLogged() {

    this._userService.getUserLogged().subscribe(
      response => {

        let result = response['user'].article.find((_element: any) => _element === this.article._id);
        if (result) {
          this.userXarticle = true;
        }


      },
      error => {
        console.log('Error al traer el usuario para verificar autor libro', error);

      }
    );

  }

  getFile(files: FileList) {
    this.file = files.item(0);
  }

  validatePDF() {
    console.log(this.file.type);

    if (this.file.type != "application/pdf") {
      this.errFileChapter = true;
    } else {
      this.errFileChapter = false;
    }

  }

  idChapter(id: any) {
    this.chapterId = id;
    this._chapterService.getChapter(id).subscribe(
      response => {
        this.chapter = response.chapter;
      },
      error => {
        console.log('Error al traer el capitulo', error);

      }
    );
  }

  edit() {

    this._chapterService.updateChapter(this.chapterId, this.chapter).subscribe(
      response => {

        if (this.fileChapter) {
          this._chapterService.uploadPDF(this.file, this.chapterId).subscribe(
            response => {

              Swal.fire(
                'Se ha editado el capitulo!!',
                'El capitulo fue editado correctamente',
                'success'
              );
              this.ngOnInit();


            },
            error => {
              Swal.fire(
                'No de ha podido editar el archivo pdf !!',
                'Error en editar el archivo',
                'error'
              );

            }
          );
        } else {
          Swal.fire(
            'Se ha editado el capitulo!!',
            'El capitulo fue editado correctamente',
            'success'
          );
          this.ngOnInit();
        }

      },
      error => {
        Swal.fire(
          'No de ha podido editar el capitulo !!',
          'Error en editar el capitulo',
          'error'
        );

      }
    );

    let close2 = document.getElementById('close2') as any;
    close2.click();
  }

  showImage() {
    if (this.file) {
      let reader = new FileReader();

      reader.onload = (e: any) => {
        this.urlImage = e.target.result;
      }

      reader.readAsDataURL(this.file);
    }
  }

  onSubmit() {
    this._articleService.updateArticle(this.Id, this.article).subscribe(
      response => {

        if (this.file) {
          this._articleService.uploadImage(this.file, response.articleUpdated._id).subscribe(
            response => {
              Swal.fire(
                'Se ha editado el libro!!',
                'El libro fue editado correctamente',
                'success'
              );
              this.ngOnInit();
            },
            error => {
              Swal.fire(
                'No de ha podido editar la image del libro !!',
                'Error en editar la imagen',
                'error'
              );

            }
          );
        } else {
          Swal.fire(
            'Se ha editado el libro!!',
            'El libro fue editado correctamente',
            'success'
          );
        }
      },
      error => {
        Swal.fire(
          'No de ha podido editar el libro !!',
          'Error en editar el libro',
          'error'
        );

      }
    );

    var modal = document.getElementById('close') as any;
    modal.click();
  }

  deleteChapter(chapterId: any) {

    Swal.fire({
      title: '¿Esta seguro de eliminar el capitulo?',
      text: 'una vez eliminado no podra recuperarse',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    })
      .then((result) => {
        if (result.isConfirmed) {

          this._chapterService.deleteChapter(chapterId).subscribe(
            response => {
              console.log('Capitulo borrado correctamente', response);
              this.ngOnInit();

            },
            error => {
              Swal.fire({
                title: 'Error al eliminar el capitulo',
                icon: 'warning'
              });
              console.log('Error al eliminar el capitulo', error);

            }
          );

          Swal.fire({
            text: "El capitulo de ha eliminado correctamente",
            icon: "success",
          });
        } else if (result.isDenied) {
          Swal.fire({
            title: "No se ha eliminado el capitulo!",
            icon: 'info'
          });
        }
      });


  }

  deleteArticle(articleId: any) {


    Swal.fire({
      title: '¿Esta seguro de eliminar el libro?',
      text: "Una vez eliminado no se podra recuperar!",
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
      title: '¿Esta seguro de eliminar el libro?',
      text: "Una vez eliminado no se podra recuperar!",
      showDenyButton: true,
      showCancelButton: true,
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

          Swal.fire({
            text: "El libro de ha eliminado correctamente",
            icon: "success",
          });
        } else if (result.isDenied) {
          Swal.fire({
            title: "No se ha eliminado el libro!",
            icon: 'info'
          });
        }
      });






  }


}
