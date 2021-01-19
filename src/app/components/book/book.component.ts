import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Article } from '../../models/article';
import { User } from '../../models/user';
import { Chapter } from '../../models/chapter';
import { List } from '../../models/list';
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


  public article: Article;
  public user: User;
  public chapter: Chapter;
  public list: List[];
  public listAdd: List;
  public chapterId: any;
  public articleid: string;
  public url: string;
  public articleSearch: Array<any>;
  public userXarticle: boolean;
  public file: any;
  public fileChapter: any
  public urlImage: any;
  public editOn: boolean;
  public errFileChapter: boolean;
  public reader: boolean;
  public userLogged: any;
  public btnList: string;
  public errNum: boolean;
  public listAction: boolean;
  public btnListDisabled: boolean;
  public btnListModal: string;
  public errOnNameList: boolean;


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
    this.userXarticle = false;
    this.urlImage = '';
    this.editOn = false;
    this.errFileChapter = null;
    this.chapterId = '';
    this.reader = false;
    this.userLogged = {};
    this.btnList = 'Agregar';
    this.errNum = false;
    this.listAction = null;
    this.btnListDisabled = false;
    this.btnListModal = 'Añadir a lista';
    this.errOnNameList = false;


    this.article = new Article('', '', '', '', '', '', [], '', []);
    this.user = new User('', '', '', '', null, '', '', '', '', null, null, null, '', '');
    this.chapter = new Chapter('', null, '', [], null, '');
    this.listAdd = new List('', '', null, null);

  }

  ngOnInit(): void {
    //id del articulo
    this._route.params.subscribe(
      response => {
        this.articleid = response.id;
      },
      error => {
        console.log('Error al traer el id del articulo');
      }
    );

    // articulo
    this._articleService.getArticleService(this.articleid, false).subscribe(
      response => {
        if (response) {
          this.article = response.article;
        } else {
          console.warn('No hay articulo');
        }
      },
      error => {
        console.log('Error al traer el articulo');
      }
    );

    // Usuario del articulo
    this._userService.getUserXArticle(this.articleid, this.reader).subscribe(
      response => {
        if (response) {
          this.user = response.user;
        } else {
          console.warn('No hay usuario...');
        }
      },
      error => {
        console.log('Error al traer el usuario');
      }
    );

    //Usuario logeado
    this._userService.getUserLogged().subscribe(
      response => {
        if (response) {
          this.userLogged = response.user;
          this.getUserCompared(this.userLogged);
          this.getList(this.userLogged._id);
        } else {
          console.warn('No hay usuario logeado');
          this.btnListDisabled = true;
          this.btnListModal = 'No hay usuario';
        }
      },
      error => {
        console.log('Error al traer el usuario logeado...');
      }
    );
  }

  addBookToList(listid: any) {
    let params = {
      articleid: this.articleid
    }
    this._listService.addBookToList(listid, params).subscribe(
      response => {
        if (response) {
          this.btnListDisabled = true;
          this.btnList = 'En lista';
        }
      },
      error => {
        console.warn('Error al añadir el libro a la lista');

      }
    );
  }

  addList() {
    if (!this.listAdd.name) {
      this.errOnNameList = true;
    } else {
      this.errOnNameList = false;
      this._listService.saveList(this.userLogged._id, this.listAdd).subscribe(
        response => {
          if (response) {
            console.log('Lista guardada con exito');
            this.listAdd.name = '';
            this.getList(this.userLogged._id);
          }
        },
        error => {
          console.warn('Error al guardar la lista');

        }
      );
    }
  }

  getList(userid: any) {
    this._listService.getList(userid).subscribe(
      response => {
        if (response) {
          this.list = response.user.list;
          this.listAction = true;
          this.bookList(response.user.list);
        } else {
          console.warn('No llega usuario con la lista...');
          this.listAction = false;
        }
      },
      error => {
        console.warn('Error al traer las listas...');

      }
    );
  }

  bookList(list: any) {

    list.forEach(element => {
      
      element.articleid.forEach(element => {
        if (element._id === this.articleid) {
          this.btnListModal = 'En lista';
        }else{
          this.btnListModal = 'Añadir a lista';
        }
      });
    });
  }

  getUserCompared(user: any) {

    const result = user.article.find((_element: any) => _element === this.article._id);
    console.log(result);
    
    if (result) {
      this.userXarticle = true;
      this.btnListModal = 'Propietario';
    } else {
      this.userXarticle = false;
    }

  }

  getFile(files: FileList) {
    this.file = files.item(0);
  }

  validateNum() {
    const expresion = /^([0-9])*$/;

    if (this.chapter.numcap) {
      const valor = this.chapter.numcap;
      if (expresion.test(valor.toString())) {
        this.errNum = false;
      } else {
        this.errNum = true;
      }
    }

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
    this._articleService.updateArticle(this.articleid, this.article).subscribe(
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
      showCancelButton: false,
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
